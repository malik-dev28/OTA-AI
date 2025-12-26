import boto3
import json
import os
from dotenv import load_dotenv

load_dotenv()

class BedrockService:
    def __init__(self):
        self.client = boto3.client(
            'bedrock-runtime',
            region_name=os.getenv('AWS_REGION', 'us-east-1'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
        )
        # Using Claude 3.5 Sonnet (latest stable on Bedrock)
        self.model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"

    def generate_response(self, prompt, context_history=None):
        """
        Generates a response from Claude via AWS Bedrock.
        """
        try:
            # Construct the conversation system prompt
            system_prompt = """You are a helpful and knowledgeable travel assistant agent for an OTA (Online Travel Agency) Flight Search App.
            Your goals are:
            1. Help users search for flights by extracting origin, destination, dates, and preferences.
            2. Answer questions about airlines, baggage policies, and travel tips.
            3. Be friendly, concise, and professional.
            
            If the user asks to search for flights, ensure you gather: Origin, Destination, Date.
            """

            # Message construction
            messages = []
            if context_history:
                # Ideally map your history format to Claude's API format
                # For now, we append previous context as text or simple user/assistant blocks
                pass
            
            messages.append({
                "role": "user",
                "content": [{"type": "text", "text": prompt}]
            })

            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "system": system_prompt,
                "messages": messages,
                "temperature": 0.7
            })

            response = self.client.invoke_model(
                body=body,
                modelId=self.model_id,
                accept='application/json',
                contentType='application/json'
            )

            response_body = json.loads(response.get('body').read())
            return response_body['content'][0]['text']

        except Exception as e:
            print(f"Error calling Bedrock: {str(e)}")
            return "I'm having trouble connecting to my AI brain (Bedrock) right now. Please check your AWS credentials."

    def extract_flight_params(self, prompt):
        """
        Specialized function to extract flight parameters using the AI.
        """
        extract_prompt = f"""
        Analyze this user query: "{prompt}"
        
        Is this a flight search request? 
        If YES, output ONLY a JSON object with these keys: 
        - origin (IATA or city)
        - destination (IATA or city)
        - departureDate (YYYY-MM-DD, assume current year {2025} if not specified)
        - returnDate (YYYY-MM-DD or null)
        - adults (int, default 1)
        
        If NO, output the string "null".
        
        Do not add markdown formatting like ```json. Just raw string.
        """
        
        try:
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 500,
                "messages": [
                    {"role": "user", "content": [{"type": "text", "text": extract_prompt}]}
                ]
            })
            
            response = self.client.invoke_model(
                body=body,
                modelId=self.model_id
            )
            
            response_text = json.loads(response.get('body').read())['content'][0]['text'].strip()
            
            if "null" in response_text.lower() and len(response_text) < 10:
                return None
            
            return json.loads(response_text)
        except Exception as e:
            print(f"Extraction error: {e}")
            return None
