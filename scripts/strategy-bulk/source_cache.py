"""Per-URL source page cache for strategy intake review.

Each source URL is fetched at most once per cache directory. Pages are kept only in
the local cache (never in hand-off artifacts) because the source sites forbid
redistribution of their text; hand-offs carry URL, hash, size and fetch metadata.
"""
import hashlib
import json
import ssl
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit
from urllib.robotparser import RobotFileParser

USER_AGENT = "Mozilla/5.0 (compatible; SF6DNA-source-check/1.0; reference verification, no redistribution)"
ALLOWED_HOSTS = {"sf6-genten.com", "www.sf6-genten.com", "acqua-souken.com", "sf6-lab.net"}
MIN_INTERVAL_SECONDS = 3.0
TIMEOUT_SECONDS = 30


def cache_key(url):
    return hashlib.sha256(url.encode("utf-8")).hexdigest()


def validate_url(url):
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.hostname not in ALLOWED_HOSTS or parts.username or parts.password:
        raise ValueError(f"Source URL outside the reviewed source sites: {url}")
    return parts


class SourceCache:
    def __init__(self, directory, offline=False, interval=MIN_INTERVAL_SECONDS):
        self.directory = Path(directory)
        self.directory.mkdir(parents=True, exist_ok=True)
        self.offline = offline
        self.interval = interval
        self.last_request = {}
        self.robots = {}
        self.context = ssl.create_default_context()
        self.network_requests = 0

    def _wait(self, host):
        elapsed = time.monotonic() - self.last_request.get(host, -1e9)
        if elapsed < self.interval:
            time.sleep(self.interval - elapsed)
        self.last_request[host] = time.monotonic()

    def _robots_allows(self, url):
        parts = urlsplit(url)
        host = parts.hostname
        if host not in self.robots:
            parser = RobotFileParser()
            self._wait(host)
            self.network_requests += 1
            request = urllib.request.Request(f"https://{host}/robots.txt", headers={"User-Agent": USER_AGENT})
            try:
                with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS, context=self.context) as response:
                    parser.parse(response.read().decode("utf-8", "replace").splitlines())
            except urllib.error.HTTPError as error:
                # Missing robots.txt allows access; any other failure stops fetching from the host.
                parser.parse([] if error.code == 404 else ["User-agent: *", "Disallow: /"])
            except OSError:
                parser.parse(["User-agent: *", "Disallow: /"])
            self.robots[host] = parser
        return self.robots[host].can_fetch(USER_AGENT, url)

    def meta_path(self, url):
        return self.directory / f"{cache_key(url)}.json"

    def body_path(self, url):
        return self.directory / f"{cache_key(url)}.html"

    def get(self, url):
        """Return (metadata, html_text or None). Cached results, including failures, are reused."""
        validate_url(url)
        meta_path, body_path = self.meta_path(url), self.body_path(url)
        if meta_path.exists():
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            meta["cacheHit"] = True
            body = body_path.read_text(encoding="utf-8") if meta["status"] == 200 and body_path.exists() else None
            if meta["status"] == 200 and (body is None or hashlib.sha256(body.encode("utf-8")).hexdigest() != meta["sha256"]):
                raise ValueError(f"Cached body missing or altered: {url}")
            return meta, body
        if self.offline:
            return {"url": url, "status": "NOT_CACHED_OFFLINE", "cacheHit": False}, None
        meta = {"url": url, "fetchedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "userAgent": USER_AGENT}
        body = None
        if not self._robots_allows(url):
            meta["status"] = "ROBOTS_DISALLOWED"
        else:
            self._wait(urlsplit(url).hostname)
            self.network_requests += 1
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "ja"})
            started = time.monotonic()
            try:
                with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS, context=self.context) as response:
                    raw = response.read()
                    charset = response.headers.get_content_charset() or "utf-8"
                    body = raw.decode(charset, "replace")
                    meta.update(status=response.status, finalUrl=response.url,
                                contentType=response.headers.get("Content-Type"),
                                lastModified=response.headers.get("Last-Modified"))
            except urllib.error.HTTPError as error:
                meta["status"] = error.code
            except OSError as error:
                meta["status"] = f"NETWORK_ERROR:{type(error).__name__}"
            meta["elapsedSeconds"] = round(time.monotonic() - started, 3)
        if body is not None:
            meta["sha256"] = hashlib.sha256(body.encode("utf-8")).hexdigest()
            meta["bytes"] = len(body.encode("utf-8"))
            body_path.write_text(body, encoding="utf-8")
        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
        meta["cacheHit"] = False
        return meta, body
