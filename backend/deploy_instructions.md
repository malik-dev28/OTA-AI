# AWS Lambda Deployment Guide

## Overview
This guide will help you deploy your OTA Flight Search backend to AWS Lambda with API Gateway.

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Python 3.9+ installed locally

## Step 1: Install Dependencies Locally

```bash
cd backend
pip install -r requirements.txt -t ./package
```

## Step 2: Create Deployment Package

### Windows PowerShell:
```powershell
# Copy your application files to the package directory
Copy-Item lambda_handler.py package/
Copy-Item main.py package/
Copy-Item bedrock_service.py package/
Copy-Item models.py package/
Copy-Item .env package/  # Optional, better to use Lambda env vars

# Create zip file
cd package
Compress-Archive -Path * -DestinationPath ../lambda_function.zip -Force
cd ..
```

### Alternative (if you have 7zip):
```bash
cd package
7z a -tzip ../lambda_function.zip *
cd ..
```

## Step 3: Create Lambda Function via AWS Console

1. **Go to AWS Lambda Console**
   - Navigate to https://console.aws.amazon.com/lambda

2. **Create Function**
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `ota-flight-search-backend`
   - Runtime: `Python 3.11` (or 3.9+)
   - Architecture: `x86_64`
   - Click "Create function"

3. **Upload Deployment Package**
   - In the Code section, click "Upload from"
   - Select ".zip file"
   - Upload `lambda_function.zip`
   - Click "Save"

4. **Configure Handler**
   - In Runtime settings, click "Edit"
   - Set Handler to: `lambda_handler.lambda_handler`
   - Click "Save"

5. **Set Environment Variables**
   - Go to Configuration → Environment variables
   - Add the following:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
     - `AWS_REGION`: Your region (e.g., `us-east-1`)

6. **Adjust Timeout and Memory**
   - Go to Configuration → General configuration → Edit
   - Timeout: `30 seconds` (for AI calls)
   - Memory: `512 MB` (adjust based on needs)
   - Click "Save"

7. **Add IAM Permissions for Bedrock**
   - Go to Configuration → Permissions
   - Click on the role name
   - Click "Add permissions" → "Attach policies"
   - Search for and attach: `AmazonBedrockFullAccess`
   - Click "Add permissions"

## Step 4: Create API Gateway

1. **Go to API Gateway Console**
   - Navigate to https://console.aws.amazon.com/apigateway

2. **Create REST API**
   - Click "Create API"
   - Choose "REST API" (not Private)
   - Click "Build"
   - API name: `OTA-Flight-Search-API`
   - Click "Create API"

3. **Create Resource (Proxy)**
   - Click "Actions" → "Create Resource"
   - Check "Configure as proxy resource"
   - Resource name: `proxy`
   - Resource path: `{proxy+}`
   - Enable CORS: Check this box
   - Click "Create Resource"

4. **Setup Integration**
   - Integration type: Lambda Function
   - Use Lambda Proxy integration: ✓ (checked)
   - Lambda Function: Select your `ota-flight-search-backend` function
   - Click "Save"
   - Confirm permission prompt

5. **Enable CORS**
   - Select the `/{proxy+}` resource
   - Click "Actions" → "Enable CORS"
   - Keep default settings
   - Click "Enable CORS and replace existing CORS headers"

6. **Deploy API**
   - Click "Actions" → "Deploy API"
   - Deployment stage: `[New Stage]`
   - Stage name: `prod`
   - Click "Deploy"

7. **Get Your API URL**
   - After deployment, you'll see an "Invoke URL"
   - It will look like: `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod`
   - **Copy this URL** - you'll need it for your frontend!

## Step 5: Update Frontend Configuration

Update your frontend to use the Lambda API URL:

```javascript
// In your frontend config or API client
const API_BASE_URL = "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod";

// Your API calls will now be:
// POST ${API_BASE_URL}/api/chat
// POST ${API_BASE_URL}/api/analyze-flight
```

## Step 6: Test Your Lambda Function

### Test via API Gateway:
```bash
curl -X POST https://YOUR_API_URL/prod/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, search flights from NYC to LAX", "history": []}'
```

### Expected Response:
```json
{
  "response": "Hello! I'd be happy to help you search for flights from NYC to LAX. ..."
}
```

## Alternative: Deploy with AWS CLI

If you prefer command line deployment:

```bash
# Create Lambda function
aws lambda create-function \
  --function-name ota-flight-search-backend \
  --runtime python3.11 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
  --handler lambda_handler.lambda_handler \
  --zip-file fileb://lambda_function.zip \
  --timeout 30 \
  --memory-size 512

# Update environment variables
aws lambda update-function-configuration \
  --function-name ota-flight-search-backend \
  --environment Variables="{AWS_REGION=us-east-1,AWS_ACCESS_KEY_ID=your_key,AWS_SECRET_ACCESS_KEY=your_secret}"
```

## Troubleshooting

### Issue: Cold Start Times
- **Solution**: Use provisioned concurrency or keep functions warm with scheduled events

### Issue: CORS Errors
- **Solution**: Ensure CORS is enabled in both API Gateway AND FastAPI middleware

### Issue: Timeout Errors
- **Solution**: Increase Lambda timeout in Configuration → General Configuration

### Issue: Permission Denied for Bedrock
- **Solution**: Verify IAM role has `AmazonBedrockFullAccess` policy attached

### Issue: Large Package Size
- **Solution**: Remove unnecessary dependencies, or use Lambda Layers for boto3

## Cost Optimization

- **Free Tier**: 1M requests/month + 400,000 GB-seconds of compute
- **After Free Tier**: ~$0.20 per 1M requests + compute time
- Monitor usage in AWS Cost Explorer

## Security Best Practices

1. **Don't hardcode credentials** in .env file uploaded to Lambda
2. **Use Lambda environment variables** or AWS Secrets Manager
3. **Restrict API Gateway** with API keys or Cognito authentication
4. **Enable CloudWatch Logs** for monitoring and debugging
5. **Use VPC** if accessing private resources

## Next Steps

- Set up custom domain with Route 53
- Add API authentication (API Keys, Cognito)
- Implement rate limiting
- Set up CloudWatch alarms for errors
- Consider using AWS SAM or Serverless Framework for easier deployments

---

**Your Lambda function is now ready to serve your frontend!** 🚀
