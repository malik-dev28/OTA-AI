# 🚀 Quick Start Guide - Local Development

## ✅ What I Fixed

1. **Fixed Vite Build Error** - Removed duplicate `newChat` key in Context.jsx
2. **Started Python Backend** - FastAPI server is now running on `http://localhost:8000`
3. **Connected Frontend to Backend** - Updated bedrock.js to use the API config module

---

## 🔧 Running the Application Locally

### Backend (Python FastAPI + AWS Bedrock)
```powershell
# Navigate to backend
cd f:\fullstack project\gemni\backend

# Start the server
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:** `http://localhost:8000`

### Frontend (React + Vite)
```powershell
# Navigate to project root
cd f:\fullstack project\gemni

# Start the dev server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173` (or the port Vite assigns)

---

## 🧪 Test Your Backend

### Check if backend is running:
```powershell
curl http://localhost:8000/
```

Expected response:
```json
{"message": "OTA Flight Search AI Backend is Running"}
```

### Test chat endpoint:
```powershell
curl -X POST http://localhost:8000/api/chat `
  -H "Content-Type: application/json" `
  -d '{"prompt": "Hello, help me find flights"}'
```

### Test flight analysis:
```powershell
curl -X POST http://localhost:8000/api/analyze-flight `
  -H "Content-Type: application/json" `
  -d '{"prompt": "Find flights from NYC to LAX on January 15th"}'
```

---

## 📁 Project Structure

```
gemni/
├── backend/                    # Python FastAPI Backend
│   ├── main.py                # FastAPI app (routes)
│   ├── bedrock_service.py     # AWS Bedrock integration
│   ├── models.py              # Pydantic models
│   ├── lambda_handler.py      # Lambda deployment wrapper
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # AWS credentials (DO NOT COMMIT!)
│
├── src/                       # React Frontend
│   ├── api/
│   │   └── bedrock.js         # Backend API calls
│   ├── components/
│   ├── config/
│   │   └── api.js             # API configuration (dev/prod)
│   └── context/
│       └── Context.jsx        # React context
│
└── docs/
    └── AWS_Setup_Guide.md     # AWS setup instructions
```

---

## 🔄 Environment Switching

The app automatically switches between:
- **Development**: Uses `http://localhost:8000`
- **Production**: Uses your Lambda API Gateway URL

Edit `src/config/api.js` to set your production URL after deploying to Lambda.

---

## ⚠️ Common Issues

### Issue: "Error connecting to AI Backend"
**Solution**: Make sure the Python backend is running on port 8000

### Issue: AWS Bedrock errors
**Solution**: Check your `.env` file in the backend folder:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
```

### Issue: Port already in use
**Solution**: Kill the process using port 8000:
```powershell
# Find process
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 🎯 Next Steps

1. ✅ **Local Development** - Both servers are running
2. 📦 **Test the app** - Try chatting and searching for flights
3. 🚀 **Deploy to Lambda** - When ready, follow `backend/LAMBDA_QUICKSTART.md`

---

**Your app is now ready for local development!** 🎉
