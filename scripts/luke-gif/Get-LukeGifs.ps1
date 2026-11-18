<#
.SYNOPSIS
  ルーク技カード用GIFの 取得 → 検査 → 技ID/slug照合 → レポート作成 を行う。段階ごとに別々に実行します。

.DESCRIPTION
  段階1 (引数なし)  : 読み取り専用。取得・検査・レポート作成まで。リポジトリは変更しません。
  段階2 -WriteLock  : 検査合格GIFのSHA256を luke-gif-lock.json に固定します(GIFのコピー・公開状態の変更はしません)。
  (人の作業)        : sheets\ の画像を目視確認し、承認する技を luke-gif-approvals.json の approvedSlugs に書きます。
  段階3 -Apply      : 「承認済み」かつ「ロック一致」のGIFだけをリポジトリへ反映します。未承認GIFは反映しません。
  -WriteLock と -Apply は同時に指定できません。

  ログ・レポート・目視確認用画像は %USERPROFILE%\SF6DNA_luke_gif_work\logs\<日時>\ の1フォルダにまとまります。
  Google Drive for desktop の同期フォルダ、取得済みフォルダにあるGIFは再ダウンロードしません(上書きもしません)。

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\luke-gif\Get-LukeGifs.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\luke-gif\Get-LukeGifs.ps1 -DriveSyncDir "G:\My Drive\SF6DNA\ルーク"

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\luke-gif\Get-LukeGifs.ps1 -WriteLock

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\luke-gif\Get-LukeGifs.ps1 -Apply
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = '',
  [string]$DriveSyncDir = '',
  [string]$WorkDir = (Join-Path $env:USERPROFILE 'SF6DNA_luke_gif_work'),
  [switch]$WriteLock,
  [switch]$Apply,
  [switch]$AllowOtherBase
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # Invoke-WebRequest の進捗表示は大幅に遅くなるため無効化

# --- UTF-8 を維持する(日本語のファイル名・ログ) ---
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$OutputEncoding = [Console]::OutputEncoding
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { }

$BaseSha = '52eddb31e0bbd3ebc316598af7d65a4acb14d087'
$ScriptDir = $PSScriptRoot
if (-not $RepoRoot) { $RepoRoot = (Resolve-Path (Join-Path $ScriptDir '..\..')).Path }
$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$LogDir = Join-Path $WorkDir ('logs\' + $Stamp)
$DownloadDir = Join-Path $WorkDir 'downloads'
$script:ExitCode = 0

function Write-Log([string]$Message) { Write-Host ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss'), $Message) }
function Stop-Script([string]$Message, [int]$Code = 2) { Write-Log "STOP $Message"; $script:ExitCode = $Code; throw 'STOP' }

# 外部コマンド(git/node)を実行して、終了コードと出力をまとめて返す。
#  - Windows PowerShell 5.1 は、外部コマンドが標準エラーに書くだけで ErrorActionPreference=Stop だと例外にするため、実行中だけ Continue にする。
#  - 終了コードは呼び出し直後に読む(後続の処理で上書きされないように)。
#  - -Stream を付けると、出力を1行ずつ画面に表示しながら実行する(node の長い処理向け)。
function Invoke-Native([string]$File, [string[]]$Arguments, [switch]$Stream) {
  $old = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $lines = New-Object System.Collections.Generic.List[string]
  try {
    & $File @Arguments 2>&1 | ForEach-Object {
      $line = "$_"
      $lines.Add($line)
      if ($Stream) { Write-Host $line }
    }
    $code = $LASTEXITCODE
  } finally { $ErrorActionPreference = $old }
  if ($null -eq $code) { $code = -1 }
  return [pscustomobject]@{ ExitCode = [int]$code; Output = ($lines -join "`n").TrimEnd() }  # 先頭の空白は残す(git status の列位置を保つため)
}

# 取得に失敗した原因を、あとで調べられる形で1行にまとめる(HTTPステータス・例外の種類・応答の先頭)。
function Get-FailureDetail($ErrorRecord) {
  $ex = $ErrorRecord.Exception
  $detail = "{0}: {1}" -f $ex.GetType().Name, $ex.Message
  $resp = $null
  if ($ex.PSObject.Properties['Response']) { $resp = $ex.Response }
  if ($null -ne $resp) {
    try { $detail += (" [HTTP {0} {1}]" -f [int]$resp.StatusCode, $resp.StatusDescription) } catch { }
  }
  return $detail
}

# 1本ダウンロードする。
#  - 途中経過は <Dest>.part に書き、検査(GIF署名・サイズ)に通ってから改名する。失敗しても既存のファイルには触れない。
#  - すでに Dest がある場合は何もしない(上書きしない)。
#  - 失敗時は原因を文字列で返し、成功時は $null を返す。
function Get-DriveFile([string]$Id, [string]$Dest, [long]$ExpectedSize) {
  if (Test-Path -LiteralPath $Dest) { return $null }
  $url = "https://drive.usercontent.google.com/download?id=$Id&export=download&confirm=t"
  $part = "$Dest.part"
  $reasons = @()
  for ($try = 1; $try -le 3; $try++) {
    try {
      if (Test-Path -LiteralPath $part) { Remove-Item -LiteralPath $part -Force }
      Invoke-WebRequest -Uri $url -OutFile $part -UseBasicParsing -TimeoutSec 900
      $len = (Get-Item -LiteralPath $part).Length
      $fs = [IO.File]::OpenRead($part)
      try { $head = New-Object byte[] 6; [void]$fs.Read($head, 0, 6) } finally { $fs.Dispose() }
      $sig = [Text.Encoding]::ASCII.GetString($head)
      if ($sig -ne 'GIF89a' -and $sig -ne 'GIF87a') {
        # 応答の先頭を記録する(Googleのログイン画面・「ウイルススキャンできません」画面などの判別用)
        $snippet = ''
        try { $snippet = ([Text.Encoding]::UTF8.GetString([IO.File]::ReadAllBytes($part), 0, [Math]::Min(200, [int]$len)) -replace '\s+', ' ') } catch { }
        throw "GIFではない応答です($len bytes)。応答の先頭: $snippet"
      }
      if ($len -ne $ExpectedSize) { throw "サイズ不一致 expected=$ExpectedSize actual=$len(途中で切れた可能性)" }
      if (Test-Path -LiteralPath $Dest) { Remove-Item -LiteralPath $part -Force; return $null }  # 取得中に別経路で置かれた場合は上書きしない
      Move-Item -LiteralPath $part -Destination $Dest
      return $null
    } catch {
      $d = Get-FailureDetail $_
      $reasons += ("試行{0}/3: {1}" -f $try, $d)
      Write-Log "WARN 取得失敗($try/3): $d"
      if (Test-Path -LiteralPath $part) { Remove-Item -LiteralPath $part -Force -ErrorAction SilentlyContinue }
      if ($try -lt 3) { Start-Sleep -Seconds (2 * $try) }
    }
  }
  return ($reasons -join ' | ')
}

New-Item -ItemType Directory -Force -Path $LogDir, $DownloadDir | Out-Null
Start-Transcript -Path (Join-Path $LogDir 'script-transcript.log') | Out-Null
try {
  Write-Log "ルークGIF 取得・検査を開始 (ログ: $LogDir)"
  if ($WriteLock -and $Apply) { Stop-Script '-WriteLock と -Apply は同時に指定できません。ロック作成 → 目視承認 → 反映を、段階ごとに別々に実行してください' }

  # --- 1. 作業ブランチとSHAの確認 ---
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Stop-Script 'git が見つかりません' }
  $r = Invoke-Native 'git' @('-C', $RepoRoot, 'rev-parse', 'HEAD')
  if ($r.ExitCode -ne 0) { Stop-Script "Gitリポジトリではありません: $RepoRoot ($($r.Output))" }
  $head = $r.Output
  $branch = (Invoke-Native 'git' @('-C', $RepoRoot, 'rev-parse', '--abbrev-ref', 'HEAD')).Output
  Write-Log "リポジトリ: $RepoRoot"
  Write-Log "ブランチ: $branch / HEAD: $head"
  if ($branch -eq 'main') { Stop-Script 'main ブランチでは実行しません。作業用ブランチ/Worktreeで実行してください' }
  $r = Invoke-Native 'git' @('-C', $RepoRoot, 'merge-base', '--is-ancestor', $BaseSha, $head)
  if ($r.ExitCode -ne 0) {
    if ($AllowOtherBase) { Write-Log "WARN 基準SHA($BaseSha)を含まないHEADですが -AllowOtherBase が指定されています" }
    else { Stop-Script "HEAD が基準SHA($BaseSha)を含んでいません。基準ブランチから作った作業用Worktreeで実行してください" }
  }

  # --- 2. 前提(Node.js)と入力ファイルの確認 ---
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Stop-Script 'Node.js が見つかりません(18以上が必要)' }
  $nodeVer = (Invoke-Native 'node' @('--version')).Output
  if ($nodeVer -notmatch '^v(\d+)\.') { Stop-Script "Node.js のバージョンを読み取れません: $nodeVer" }
  if ([int]$Matches[1] -lt 18) { Stop-Script "Node.js $nodeVer は古すぎます(18以上が必要)" }
  Write-Log "Node.js $nodeVer"
  $mappingPath = Join-Path $ScriptDir 'luke-gif-mapping.json'
  $verify = Join-Path $ScriptDir 'verify-luke-gifs.mjs'
  $approvalsPath = Join-Path $ScriptDir 'luke-gif-approvals.json'
  foreach ($p in @($mappingPath, $verify, (Join-Path $ScriptDir 'gif-inspect.mjs'), $approvalsPath)) {
    if (-not (Test-Path -LiteralPath $p)) { Stop-Script "必要なファイルがありません: $p" }
  }
  $mapping = Get-Content -LiteralPath $mappingPath -Raw -Encoding UTF8 | ConvertFrom-Json

  # --- 3. 書き込み前の安全確認(-WriteLock / -Apply のとき。ここで止まれば何も書かれない) ---
  if ($WriteLock -or $Apply) {
    $manifestRel = 'v2-web/src/data/SF6DNA_VER1_LUKE_GIF_MANIFEST_20261116.json'
    $gifDirRel = 'v2-web/public/media/moves/luke/gif'
    $lockRel = 'scripts/luke-gif/luke-gif-lock.json'
    # 書き込み先として「想定してよい」パス。内容が正しいかどうかは Node 側で確認する(SHA256・マニフェスト検証)。
    $expected = @{}
    $expected[$manifestRel] = $true
    $expected[$lockRel] = $true
    foreach ($f in @($mapping.files | Where-Object { $_.role -eq 'candidate' })) { $expected["$gifDirRel/$($f.slug).gif"] = $true }
    $st = Invoke-Native 'git' @('-C', $RepoRoot, '-c', 'core.quotepath=false', 'status', '--porcelain', '--untracked-files=all', '--', $manifestRel, $gifDirRel, $lockRel)
    if ($st.ExitCode -ne 0) { Stop-Script "git status に失敗しました: $($st.Output)" }
    $unexpected = @()
    foreach ($line in @($st.Output -split "`n" | Where-Object { $_.Trim() })) {
      $code = $line.Substring(0, 2)
      $file = $line.Substring(3).Trim('"')
      # 削除・競合・名前変更は、前回の結果ではなく人の作業の痕跡なので止める
      if ($code -match 'D|U|R|C' -or $code -eq 'AA' -or -not $expected.ContainsKey($file)) { $unexpected += $line }
    }
    if ($unexpected.Count -gt 0) {
      Stop-Script ("書き込み先に予期しない未コミット変更があります。内容を確認し、退避またはコミット(ご自身の判断で)してから再実行してください:`n  " + ($unexpected -join "`n  "))
    }
  }
  if ($Apply) {
    $appr = Get-Content -LiteralPath $approvalsPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $appr.PSObject.Properties['approvedSlugs'] -or @($appr.approvedSlugs).Count -eq 0) {
      Stop-Script '-Apply には承認済みの技が必要です。映像を目視確認して、luke-gif-approvals.json の approvedSlugs に書いてください(承認前は反映しません)' 1
    }
    if (-not (Test-Path -LiteralPath (Join-Path $ScriptDir 'luke-gif-lock.json'))) {
      Stop-Script 'SHA256ロックがありません。先に -WriteLock を実行してください(-Apply はロックを作りません)' 1
    }
  }

  # --- 4. 既存の素材を探す(Drive for desktop 同期フォルダ / 取得済みフォルダ) ---
  $searchDirs = New-Object System.Collections.Generic.List[string]
  if ($DriveSyncDir) {
    if (-not (Test-Path -LiteralPath $DriveSyncDir)) { Stop-Script "-DriveSyncDir が見つかりません: $DriveSyncDir" }
    $searchDirs.Add((Resolve-Path -LiteralPath $DriveSyncDir).Path)
  } else {
    $roots = @("$env:USERPROFILE\My Drive", "$env:USERPROFILE\マイドライブ", "$env:USERPROFILE\Google Drive")
    foreach ($l in 'G', 'H', 'I', 'D', 'E', 'F') { $roots += "${l}:\My Drive"; $roots += "${l}:\マイドライブ" }
    foreach ($root in $roots) {
      if (-not (Test-Path -LiteralPath $root)) { continue }
      $found = Get-ChildItem -LiteralPath $root -Directory -Recurse -Depth 3 -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'ルーク' } | Select-Object -First 1
      if ($found) { $searchDirs.Add($found.FullName); Write-Log "Drive同期フォルダを検出: $($found.FullName)" }
    }
    if ($searchDirs.Count -eq 0) { Write-Log 'Drive for desktop の「ルーク」フォルダは見つかりませんでした(ダウンロードで取得します)' }
  }
  $searchDirs.Add($DownloadDir)

  $have = @{}
  foreach ($d in $searchDirs) {
    Get-ChildItem -LiteralPath $d -Recurse -File -Filter '*.gif' -ErrorAction SilentlyContinue | ForEach-Object { if (-not $have.ContainsKey($_.Name)) { $have[$_.Name] = $_.FullName } }
  }

  # --- 5. 足りないGIFだけ取得する(fetch=true のみ。既存は再取得も上書きもしない) ---
  $targets = @($mapping.files | Where-Object { $_.fetch })
  $missing = @($targets | Where-Object { -not $have.ContainsKey($_.driveTitle) })
  Write-Log ("取得対象 {0} 本 / 既に手元にある {1} 本 / これから取得 {2} 本" -f $targets.Count, ($targets.Count - $missing.Count), $missing.Count)
  $failures = New-Object System.Collections.Generic.List[string]
  $i = 0
  foreach ($f in $missing) {
    $i++
    Write-Log ("取得 {0}/{1}: {2}" -f $i, $missing.Count, $f.driveTitle)
    $why = Get-DriveFile -Id $f.driveId -Dest (Join-Path $DownloadDir $f.driveTitle) -ExpectedSize ([long]$f.expectedSize)
    if ($why) { $failures.Add(("{0} (id={1}) : {2}" -f $f.driveTitle, $f.driveId, $why)) }
  }
  if ($failures.Count -gt 0) {
    # 失敗の一覧を専用ログに残す(取得できた分は残るので、再実行すると続きから取得する)
    $failLog = Join-Path $LogDir 'download-failures.log'
    [IO.File]::WriteAllText($failLog, (($failures -join "`r`n") + "`r`n"), (New-Object System.Text.UTF8Encoding($false)))
    Write-Log ("ERROR {0} 本を取得できませんでした。詳細: {1}" -f $failures.Count, $failLog)
    foreach ($m in $failures) { Write-Log "  - $m" }
    Stop-Script ("取得に失敗したため検査へ進みません。対処: Drive for desktop で同期したフォルダを -DriveSyncDir で指定するか、ブラウザで手動ダウンロードして {0} に置き、再実行してください(取得済みの分は再取得しません)" -f $DownloadDir)
  }

  # --- 6. 検査・分類・照合(Node。レポートは同じログフォルダへ) ---
  $nodeArgs = @($verify, '--repo-root', $RepoRoot, '--out', $LogDir, '--sheets')
  foreach ($d in $searchDirs) { $nodeArgs += @('--search-dir', $d) }
  if ($WriteLock) { $nodeArgs += '--write-lock' }
  if ($Apply) { $nodeArgs += '--apply' }
  $stage = 'GIFの検査(段階1)'
  if ($WriteLock) { $stage = 'SHA256ロックの作成(段階2)' }
  if ($Apply) { $stage = '承認済みGIFの反映(段階3)' }
  Write-Log "$stage を実行します"
  $n = Invoke-Native 'node' $nodeArgs -Stream
  $code = $n.ExitCode
  if ($code -notin 0, 1, 2) { Write-Log "ERROR node が想定外の終了コード($code)で終了しました"; $code = 2 }
  Write-Log ("終了コード: {0}  (0=合格 / 1=不合格・承認不足などで停止(レポート参照) / 2=実行不能)" -f $code)
  Write-Log ("レポート: {0}" -f (Join-Path $LogDir 'luke-gif-report.md'))
  Write-Log ("目視確認用の画像: {0}" -f (Join-Path $LogDir 'sheets'))
  $script:ExitCode = $code
}
catch {
  if ($_.Exception.Message -ne 'STOP') { Write-Log "ERROR $(Get-FailureDetail $_)"; $script:ExitCode = 2 }
}
finally {
  try { Stop-Transcript | Out-Null } catch { }
}
exit $script:ExitCode
