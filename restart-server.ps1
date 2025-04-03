Write-Host "Stopping any existing server processes..."
$processesToKill = @(
    "node.exe"
)

foreach ($process in $processesToKill) {
    $running = Get-Process -Name $process -ErrorAction SilentlyContinue
    if ($running) {
        try {
            Get-Process -Name $process | Where-Object { $_.MainWindowTitle -eq "" } | Stop-Process -Force
            Write-Host "Stopped $process"
        } catch {
            Write-Host "Failed to stop $process"
        }
    }
}

Write-Host "Starting NestJS server..."
npm run start:dev 