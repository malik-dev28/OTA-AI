# Lambda Deployment - Quick Start

## ✅ What We've Created

1. **`lambda_handler.py`** - Lambda entry point using Mangum
2. **`deploy_instructions.md`** - Full detailed deployment guide
3. **`package_lambda.ps1`** - PowerShell script to automate packaging
4. **`src/config/api.js`** - Frontend API configuration

## 🚀 Quick Deployment Steps

### 1. Package Your Lambda Function
```powershell
cd backend
.\package_lambda.ps1
```

This will create `lambda_function.zip` with all your code and dependencies.

### 2. Deploy to AWS Lambda (via Console)

1. **Create Lambda Function:**
   - Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda)
   - Click "Create function"
   - Name: `ota-flight-search-backend`
   - Runtime: Python 3.11
   - Create function

2. **Upload Code:**
   - Upload `lambda_function.zip`
   - Set handler to: `lambda_handler.lambda_handler`

3. **Configure:**
   - Timeout: 30 seconds
   - Memory: 512 MB
   - Environment variables:
     - `AWS_REGION`: Your AWS region
     - (AWS credentials will be handled by IAM role)

4. **Add Bedrock Permissions:**
   - Go to Configuration → Permissions
   - Attach policy: `AmazonBedrockFullAccess`

### 3. Create API Gateway

1. **Create REST API:**
   - Go to [API Gateway Console](https://console.aws.amazon.com/apigateway)
   - Create REST API named `OTA-Flight-Search-API`

2. **Create Proxy Resource:**
   - Create resource with path `{proxy+}`
   - Integration: Lambda Proxy
   - Select your Lambda function

3. **Deploy:**
   - Deploy to stage `prod`
   - Copy the Invoke URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

### 4. Update Frontend

Edit `src/config/api.js`:
```javascript
production: 'https://YOUR_ACTUAL_API_URL/prod',
```

Replace with your actual API Gateway URL.

### 5. Test!

```bash
# Test the API
curl -X POST https://YOUR_API_URL/prod/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Find flights from NYC to LAX"}'
```

## 🔧 Local Development

```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend (already running)
npm run dev
```

## 📊 Architecture

```
Frontend (Vite)
    ↓ HTTPS
API Gateway
    ↓ Invoke
AWS Lambda (FastAPI + Mangum)
    ↓ boto3
AWS Bedrock (Claude AI)
```

## 💰 Estimated Costs

- **Free Tier:** 1M Lambda requests/month
- **After Free Tier:** ~$0.20 per 1M requests
- **Bedrock:** Pay per token 

## 🆘 Need Help?

See `deploy_instructions.md` for detailed troubleshooting and advanced configuration!

---

**Your backend is now Lambda-ready!** 🎉
