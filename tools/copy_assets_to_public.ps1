# Copies generated assets from outputs/agent_deliverables to public/assets so the game can load them.
# Run after image_worker (or orchestrator) produces files.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
if (-not $root) { $root = (Get-Location).Path }
$src = Join-Path $root "outputs\agent_deliverables"
$dst = Join-Path $root "public\assets"

if (-not (Test-Path $src)) {
  Write-Host "Source not found: $src. Run image tasks first."
  exit 0
}

New-Item -ItemType Directory -Path $dst -Force | Out-Null
$count = 0
Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length).TrimStart('\')
  $target = Join-Path $dst $rel
  $dir = Split-Path $target -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Copy-Item $_.FullName -Destination $target -Force
  $count++
}
Write-Host "Copied $count file(s) to public/assets"
