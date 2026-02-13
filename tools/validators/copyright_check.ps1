# copyright_check.ps1
param([string]$filePath)
$forbidden = @("Frodo", "Samwise", "Gandalf", "Aragorn", "Legolas", "Gimli", "Boromir", "Sauron", "Saruman", "Rivendell", "Mordor", "Shire")
$content = Get-Content $filePath -Raw
foreach ($name in $forbidden) {
    if ($content -match "\b$name\b") {
        Write-Host "❌ Copyright violation: Found forbidden term '$name' in $filePath"
        exit 1
    }
}
Write-Host "✅ Copyright check passed."
exit 0
