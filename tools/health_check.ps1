# health_check.ps1 - Verify Ollama and ComfyUI are reachable.
# Run from project root. Writes logs/env_status.json for Gemini and callback scripts.

$ErrorActionPreference = "SilentlyContinue"
$ollamaUrl = "http://localhost:11434/api/tags"
$comfyUrl = "http://localhost:8188/"
$statusPath = "logs/env_status.json"
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
Set-Location $projectRoot

$status = @{
    ollama   = "down"
    comfyui  = "down"
    checked_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
}

try {
    $null = Invoke-RestMethod -Uri $ollamaUrl -Method Get -TimeoutSec 5
    $status.ollama = "ok"
} catch {
    $status.ollama = "down"
}

try {
    $null = Invoke-RestMethod -Uri $comfyUrl -Method Get -TimeoutSec 5
    $status.comfyui = "ok"
} catch {
    $status.comfyui = "down"
}

$logsDir = "logs"
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir -Force | Out-Null }
$status | ConvertTo-Json | Set-Content $statusPath -Encoding UTF8
Write-Host "Health check complete. Ollama: $($status.ollama), ComfyUI: $($status.comfyui). Written to $statusPath"
