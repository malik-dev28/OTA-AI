from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from bedrock_service import BedrockService
from models import FlightSearchRequest, FlightSearchResponse
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bedrock = BedrockService()

class ChatRequest(BaseModel):
    prompt: str
    history: list = []

@app.get("/")
def read_root():
    return {"message": "OTA Flight Search AI Backend is Running"}

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    response = bedrock.generate_response(request.prompt, request.history)
    return {"response": response}

@app.post("/api/analyze-flight")
async def analyze_flight(request: ChatRequest):
    params = bedrock.extract_flight_params(request.prompt)
    return {"params": params}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
