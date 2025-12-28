# PowerShell script to package Lambda deployment
# Run this script from the backend directory

Write-Host "Starting Lambda deployment package creation..." -ForegroundColor Green

# Clean up old packages
Write-Host "Cleaning up old packages..." -ForegroundColor Yellow
if (Test-Path "package") {
    Remove-Item -Recurse -Force package
}
if (Test-Path "lambda_function.zip") {
    Remove-Item -Force lambda_function.zip
}

# Create package directory
Write-Host "Creating package directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "package" | Out-Null

# Install dependencies
Write-Host "Installing dependencies to package directory..." -ForegroundColor Yellow
pip install -r requirements.txt -t ./package --upgrade

# Copy application files
Write-Host "Copying application files..." -ForegroundColor Yellow
Copy-Item lambda_handler.py package/
Copy-Item main.py package/
Copy-Item bedrock_service.py package/
Copy-Item models.py package/

# Note: Don't copy .env - use Lambda environment variables instead
Write-Host "NOTE: .env file not copied. Use Lambda environment variables!" -ForegroundColor Cyan

# Create zip file
Write-Host "Creating deployment zip file..." -ForegroundColor Yellow
Push-Location package
Compress-Archive -Path * -DestinationPath ../lambda_function.zip -Force
Pop-Location

# Get file size
$fileSize = (Get-Item lambda_function.zip).Length / 1MB
Write-Host "✓ Deployment package created successfully!" -ForegroundColor Green
Write-Host "  File: lambda_function.zip" -ForegroundColor White
Write-Host "  Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor White

if ($fileSize -gt 50) {
    Write-Host "WARNING: Package size exceeds 50MB. Consider using Lambda Layers!" -ForegroundColor Red
} elseif ($fileSize -gt 10) {
    Write-Host "INFO: Package size is large. Upload directly to Lambda console or S3." -ForegroundColor Yellow
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Go to AWS Lambda Console" -ForegroundColor White
Write-Host "2. Create/Update your Lambda function" -ForegroundColor White
Write-Host "3. Upload lambda_function.zip" -ForegroundColor White
Write-Host "4. Set handler to: lambda_handler.lambda_handler" -ForegroundColor White
Write-Host "5. Configure environment variables" -ForegroundColor White
Write-Host "`nSee deploy_instructions.md for detailed steps!" -ForegroundColor Green
