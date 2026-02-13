# agent_worker.ps1 - Local LLM Agent Task Runner (Orchestration schema)
# Run from project root. Consumes tasks/queue.json; writes to outputs/agent_deliverables/.
# Filters by assigned_to: "local_llm_agent". Falls back to backlog when main queue empty.

$queuePath = "tasks/queue.json"
$statusPath = "logs/agent_status.json"
$errorPath = "logs/agent_errors.json"
$backlogDonePath = "logs/backlog_done.json"
$ollamaUrl = "http://localhost:11434/api/generate"
$configPath = "tools/agent_config.json"
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
Set-Location $projectRoot

# Model: from agent_config.json or env OLLAMA_MODEL or default
$model = "llama3.2:3b"
if ($env:OLLAMA_MODEL) { $model = $env:OLLAMA_MODEL }
if (Test-Path $configPath) {
    try {
        $cfg = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($cfg.model) { $model = $cfg.model }
    } catch {}
}

function Log-Error($taskId, $errorMsg) {
    $errorLog = @{
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        taskId = $taskId
        error = $errorMsg
    }
    $logs = @()
    if (Test-Path $errorPath) { $logs = Get-Content $errorPath -Raw | ConvertFrom-Json }
    if (-not $logs) { $logs = @() }
    $logs += $errorLog
    $logs | ConvertTo-Json -Depth 10 | Set-Content $errorPath
}

function Append-Status($taskId, $outputPath, $fromBacklog) {
    $entry = @{
        task_id = $taskId
        output_path = $outputPath
        completed_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        from_backlog = $fromBacklog
    }
    $status = @{ completed = @() }
    if (Test-Path $statusPath) {
        try {
            $status = Get-Content $statusPath -Raw | ConvertFrom-Json
            if (-not $status.completed) { $status.completed = @() }
        } catch {}
    }
    $status.completed += $entry
    $status.last_updated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    $status | ConvertTo-Json -Depth 10 | Set-Content $statusPath
}

function Get-BacklogDoneIds() {
    if (-not (Test-Path $backlogDonePath)) { return @() }
    try {
        $data = Get-Content $backlogDonePath -Raw | ConvertFrom-Json
        return @($data.completed_ids)
    } catch { return @() }
}

function Add-BacklogDoneId($id) {
    $data = @{ completed_ids = @() }
    if (Test-Path $backlogDonePath) {
        try {
            $data = Get-Content $backlogDonePath -Raw | ConvertFrom-Json
            if (-not $data.completed_ids) { $data.completed_ids = @() }
        } catch {}
    }
    $data.completed_ids += $id
    $data | ConvertTo-Json | Set-Content $backlogDonePath
}

while ($true) {
    if (-not (Test-Path $queuePath)) { Start-Sleep -Seconds 10; continue }

    $queue = Get-Content $queuePath -Raw | ConvertFrom-Json
    $tasks = @($queue.tasks)
    $backlog = @($queue.backlog)

    # Pending main task for local_llm_agent
    $pendingTask = $tasks | Where-Object { $_.status -eq "pending" -and $_.assigned_to -eq "local_llm_agent" } | Select-Object -First 1

    # If no main task, try backlog (skip already-done)
    $fromBacklog = $false
    if ($null -eq $pendingTask -and $backlog.Count -gt 0) {
        $doneIds = Get-BacklogDoneIds
        $backlogItem = $backlog | Where-Object { $_.id -notin $doneIds } | Select-Object -First 1
        if ($null -ne $backlogItem) {
            $fromBacklog = $true
            $pendingTask = @{
                id = $backlogItem.id
                prompt = $backlogItem.prompt
                output_path = "outputs/agent_deliverables/backlog/$($backlogItem.id).txt"
                status = "pending"
            }
        }
    }

    if ($null -eq $pendingTask) {
        Write-Host "No pending tasks or backlog. Waiting..."
        Start-Sleep -Seconds 30
        continue
    }

    Write-Host "Processing Task: $($pendingTask.id)" $(if ($fromBacklog) { "(backlog)" })
    if (-not $fromBacklog) {
        $taskInQueue = $tasks | Where-Object { $_.id -eq $pendingTask.id } | Select-Object -First 1
        if ($taskInQueue) { $taskInQueue.status = "in_progress" }
        $queue.tasks = $tasks
        $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath
    }

    $outputPath = $pendingTask.output_path
    $dir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    try {
        $body = @{
            model = $model
            prompt = $pendingTask.prompt
            stream = $false
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri $ollamaUrl -Method Post -Body $body -ContentType "application/json"

        $response.response | Set-Content $outputPath -Encoding UTF8

        if ($fromBacklog) {
            Add-BacklogDoneId $pendingTask.id
        } else {
            $taskInQueue = $tasks | Where-Object { $_.id -eq $pendingTask.id } | Select-Object -First 1
            if ($taskInQueue) {
                $taskInQueue.status = "complete"
                $taskInQueue | Add-Member -MemberType NoteProperty -Name "completed_at" -Value (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") -Force
            }
            $queue.tasks = $tasks
            $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath
        }

        Append-Status $pendingTask.id $outputPath $fromBacklog
    } catch {
        if (-not $fromBacklog) {
            $taskInQueue = $tasks | Where-Object { $_.id -eq $pendingTask.id } | Select-Object -First 1
            if ($taskInQueue) { $taskInQueue.status = "failed" }
            $queue.tasks = $tasks
            $queue | ConvertTo-Json -Depth 10 | Set-Content $queuePath
            Log-Error $pendingTask.id $_.Exception.Message
        }
    }

    Start-Sleep -Seconds 2
}
