/**
 * API Configuration for OTA Flight Search App
 * Switch between local development and AWS Lambda production
 */

// Environment detection
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// API Base URLs
const API_URLS = {
  // Local FastAPI development server
  development: 'http://localhost:8000',
  
  // AWS Lambda + API Gateway (UPDATE THIS AFTER DEPLOYMENT)
  production: 'https://YOUR_API_GATEWAY_URL.execute-api.us-east-1.amazonaws.com/prod',
};

// Select appropriate API URL based on environment
export const API_BASE_URL = isProduction ? API_URLS.production : API_URLS.development;

// API Endpoints
export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/api/chat`,
  analyzeFlightParams: `${API_BASE_URL}/api/analyze-flight`,
  // Add more endpoints as needed
};

// API Helper Functions
export const apiClient = {
  /**
   * Send a chat message to the AI
   */
  async sendChatMessage(prompt, history = []) {
    try {
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, history }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },

  /**
   * Analyze flight parameters from user query
   */
  async analyzeFlightParams(prompt) {
    try {
      const response = await fetch(API_ENDPOINTS.analyzeFlightParams, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.params;
    } catch (error) {
      console.error('Error analyzing flight params:', error);
      throw error;
    }
  },
};

// Debug logging
console.log('🌐 API Configuration:', {
  environment: isProduction ? 'Production' : 'Development',
  baseURL: API_BASE_URL,
});

export default apiClient;
