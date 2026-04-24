# Forever Shopping - Start All Services
# Run this script to start backend, frontend, and admin

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Forever Shopping E-Commerce" -ForegroundColor Cyan
Write-Host "  Starting All Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoCheck -and $mongoCheck.Status -eq "Running") {
        Write-Host "✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB service not found or not running" -ForegroundColor Red
        Write-Host "Please install MongoDB or use MongoDB Atlas" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Download MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        Write-Host "Or use cloud: https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
        Write-Host ""
        $continue = Read-Host "Continue anyway? (y/n)"
        if ($continue -ne "y") { exit }
    }
} catch {
    Write-Host "⚠ Could not check MongoDB status" -ForegroundColor Red
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Starting Backend...' -ForegroundColor Green; npm start"
Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Starting Frontend...' -ForegroundColor Green; npm run dev"
Start-Sleep -Seconds 2

Write-Host "Starting Admin Panel..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\admin'; Write-Host 'Starting Admin...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Services Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Admin:    http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "Check the terminal windows for status" -ForegroundColor Yellow
Write-Host ""
