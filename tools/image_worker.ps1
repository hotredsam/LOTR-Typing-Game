# image_worker.ps1 - Image generation agent (ComfyUI or Automatic1111)
# Run from project root. Polls tasks/queue.json for assigned_to: "image_gen_agent", type: "asset_generation".
# Saves images to output_path; updates queue and logs/agent_status.json.

$ErrorActionPreference = "SilentlyContinue"
$queuePath = "tasks/queue.json"
$statusPath = "logs/agent_status.json"
$errorPath = "logs/agent_errors.json"
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
Set-Location $projectRoot

# Backend: "a1111" (Automatic1111, port 7860) or "comfyui" (port 8188, requires workflow template)
$imageBackend = if ($env:IMAGE_BACKEND) { $env:IMAGE_BACKEND } else { "a1111" }
$a1111Url = "http://localhost:7860/sdapi/v1/txt2img"
$comfyUrl = "http://localhost:8188/prompt"
$styleSuffix = "pixel art, 32x32, retro game, clean lines, limited palette"

function Log-Error($taskId, $errorMsg) {
    $errorLog = @{ timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"); taskId = $taskId; error = $errorMsg }
    $logs = @()
    if (Test-Path $errorPath) { try { $logs = Get-Content $errorPath -Raw | ConvertFrom-Json } catch {} }
    $logs += $errorLog
    $logs | ConvertTo-Json -Depth 10 | Set-Content $errorPath
}

function Append-Status($taskId, $outputPath) {
    $entry = @{ task_id = $taskId; output_path = $outputPath; completed_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") }
    $status = @{ completed = @() }
    if (Test-Path $statusPath) { try { $status = Get-Content $statusPath -Raw | ConvertFrom-Json; if (-not $status.completed) { $status.completed = @() } } catch {} }
    $status.completed += $entry
    $status.last_updated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    $status | ConvertTo-Json -Depth 10 | Set-Content $statusPath
}

function Invoke-A1111($prompt, $width, $height, $seed) {
    $body = @{
        prompt = "$prompt, $styleSuffix"
        negative_prompt = "blurry, low quality"
        steps = 20
        width = $width
        height = $height
        seed = if ($seed -ge 0) { $seed } else { [int][double]::Parse((Get-Date -UFormat %s)) }
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Uri $a1111Url -Method Post -Body $body -ContentType "application/json"
    if ($r.images -and $r.images.Count -gt 0) { return [Convert]::FromBase64String($r.images[0]) }
    throw "No image in response"
}

function Invoke-ComfyUI($prompt, $width, $height, $seed) {
    # ComfyUI requires a workflow JSON. See docs/ENV_SETUP.md for how to add tools/comfyui_workflow.json.
    # For simple prompt-to-image, set IMAGE_BACKEND=a1111 and use Automatic1111 (port 7860).
    throw "ComfyUI backend not implemented in this script. Set IMAGE_BACKEND=a1111 and use Automatic1111 (--api), or see docs/ENV_SETUP.md for ComfyUI workflow setup."
}

while ($true) {
    if (-not (Test-Path $queuePath)) { Start-Sleep -Seconds 15; continue }

    $queue = Get-Content $queuePath -Raw | ConvertFrom-Json
    $pending = $queue.tasks | Where-Object { $_.status -eq "pending" -and $_.assigned_to -eq "image_gen_agent" } | Select-Object -First 1
    if ($null -eq $pending) {
        Write-Host "No pending image tasks. Waiting..."
        Start-Sleep -Seconds 30
        continue
    }

    $taskId = $pending.id
    $outputPath = $pending.output_path
    $prompt = $pending.prompt
    $params = $pending.parameters
    $width = 32; $height = 32; $seed = -1
    if ($params) {
        if ($params.width) { $width = $params.width }
        if ($params.height) { $height = $params.height }
        if ($params.seed) { $seed = $params.seed }
    }
    if ($params.style) { $script:styleSuffix = $params.style }

    Write-Host "Processing image task: $taskId"
    $taskInQueue = $queue.tasks | Where-Object { $_.id -eq $taskId } | Select-Object -First 1
    $taskInQueue.status = "in_progress"
    $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath

    $dir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    try {
        $bytes = $null
        if ($imageBackend -eq "a1111") {
            $bytes = Invoke-A1111 -prompt $prompt -width $width -height $height -seed $seed
        } else {
            $bytes = Invoke-ComfyUI -prompt $prompt -width $width -height $height -seed $seed
        }
        [System.IO.File]::WriteAllBytes((Join-Path $projectRoot $outputPath), $bytes)
        $taskInQueue.status = "complete"
        $taskInQueue | Add-Member -MemberType NoteProperty -Name "completed_at" -Value (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") -Force
        $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath
        Append-Status $taskId $outputPath
    } catch {
        $taskInQueue.status = "failed"
        $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath
        Log-Error $taskId $_.Exception.Message
        Write-Host "Image task failed: $_"
    }

    Start-Sleep -Seconds 2
}
