# typescript_check.ps1
param([string]$filePath)
Write-Host "Checking TypeScript compilation for $filePath..."
$tscPath = ".\node_modules\.bin\tsc"
# Run tsc on the specific file but with project context and JSX support
& $tscPath --noEmit --esModuleInterop --skipLibCheck --target ESNext --moduleResolution node --jsx react-jsx $filePath
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript check passed."
    exit 0
} else {
    Write-Host "❌ TypeScript check failed."
    exit 1
}
