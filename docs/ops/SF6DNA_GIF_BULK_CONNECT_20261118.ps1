<#
SF6DNA GIF bulk connect (user PC). Dry-run by default; nothing is written without -Apply.
- Ledger : docs/ops/GIF_RESTORE_TODO_148_20261118.csv (character,moveSlug,localFile,sha256,bytes,driveFileId,weakEvidence)
- Excludes Luke GIFs listed in docs/ops/LUKE_GIF11_LOCATION_20261118.csv (already restored) and all luke rows.
- Accepts a file only if SHA-256 AND byte size match the ledger. Never overwrites a different existing file.
- Writes only under <RepoRoot>\.sf6dna-local-qa-gif\ (local QA dir; not committed). No DB, no network.
Usage:
  pwsh -File docs/ops/SF6DNA_GIF_BULK_CONNECT_20261118.ps1 -ZipDir "$HOME\Downloads\SF6DNA_GIF" -RepoRoot .
  pwsh -File docs/ops/SF6DNA_GIF_BULK_CONNECT_20261118.ps1 -ZipDir "$HOME\Downloads\SF6DNA_GIF" -RepoRoot . -Apply
#>
param(
  [Parameter(Mandatory = $true)][string]$ZipDir,
  [string]$RepoRoot = ".",
  [string]$Ledger = "docs/ops/GIF_RESTORE_TODO_148_20261118.csv",
  [string]$LukeList = "docs/ops/LUKE_GIF11_LOCATION_20261118.csv",
  [switch]$Apply
)
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path $RepoRoot).Path
$targetRoot = Join-Path $RepoRoot ".sf6dna-local-qa-gif"
$ledgerRows = Import-Csv (Join-Path $RepoRoot $Ledger)
$lukeSha = @{}
if (Test-Path (Join-Path $RepoRoot $LukeList)) { Import-Csv (Join-Path $RepoRoot $LukeList) | ForEach-Object { $lukeSha[$_.sha256_expected.ToLower()] = $true } }

# 1) Extract every zip to a private temp folder (zip-slip guarded by Expand-Archive into a fresh dir).
$work = Join-Path ([IO.Path]::GetTempPath()) ("sf6dna-gif-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $work | Out-Null
$zips = Get-ChildItem -Path $ZipDir -Filter "*.zip" -File | Sort-Object Name
if (-not $zips) { throw "No zip files in $ZipDir" }
foreach ($z in $zips) {
  $dest = Join-Path $work $z.BaseName
  Expand-Archive -LiteralPath $z.FullName -DestinationPath $dest
  Write-Host ("extracted {0} ({1:N0} bytes)" -f $z.Name, $z.Length)
}

# 2) Index extracted GIFs by SHA-256 (location inside the zip does not matter).
$bySha = @{}
Get-ChildItem -Path $work -Recurse -File -Filter "*.gif" | ForEach-Object {
  $h = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash.ToLower()
  if (-not $bySha.ContainsKey($h)) { $bySha[$h] = $_ }
}

# 3) Match ledger rows.
$report = foreach ($row in $ledgerRows) {
  $sha = $row.sha256.ToLower()
  $status = ""
  $rel = $row.localFile -replace '^\.sf6dna-local-qa-gif[\\/]', ''
  if ($rel -match '(^|[\\/])\.\.([\\/]|$)' -or [IO.Path]::IsPathRooted($rel)) { $status = "REJECT_UNSAFE_PATH" }
  elseif ($row.character -eq "luke" -or $lukeSha.ContainsKey($sha)) { $status = "SKIP_LUKE_ALREADY_RESTORED" }
  elseif (-not $bySha.ContainsKey($sha)) { $status = "HOLD_NOT_IN_ZIPS" }
  else {
    $src = $bySha[$sha]
    $dst = Join-Path $targetRoot $rel
    if ($src.Length -ne [int64]$row.bytes) { $status = "REJECT_SIZE_MISMATCH" }
    elseif (Test-Path -LiteralPath $dst) {
      $existing = (Get-FileHash -Algorithm SHA256 -LiteralPath $dst).Hash.ToLower()
      $status = if ($existing -eq $sha) { "SKIP_ALREADY_PRESENT" } else { "CONFLICT_EXISTING_DIFFERENT" }
    }
    elseif ($Apply) {
      New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
      Copy-Item -LiteralPath $src.FullName -Destination $dst
      $after = (Get-FileHash -Algorithm SHA256 -LiteralPath $dst).Hash.ToLower()
      $status = if ($after -eq $sha) { "CONNECTED" } else { Remove-Item -LiteralPath $dst; "REJECT_COPY_VERIFY_FAILED" }
    }
    else { $status = "READY (dry-run)" }
  }
  [pscustomobject]@{ character = $row.character; moveSlug = $row.moveSlug; localFile = $row.localFile; sha256 = $sha; bytes = $row.bytes; weakEvidence = $row.weakEvidence; status = $status }
}

$out = Join-Path $RepoRoot ("docs/ops/GIF_BULK_CONNECT_RESULT_{0}.csv" -f (Get-Date -Format "yyyyMMdd_HHmmss"))
$report | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $out
$report | Group-Object status | Sort-Object Name | ForEach-Object { Write-Host ("{0,-30} {1}" -f $_.Name, $_.Count) }
Write-Host "result: $out"
Remove-Item -Recurse -Force $work
if (-not $Apply) { Write-Host "Dry-run only. Re-run with -Apply to copy READY files." }
