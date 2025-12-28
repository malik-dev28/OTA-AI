"""
AWS Lambda Handler for OTA Flight Search Backend
This file wraps the FastAPI app with Mangum to work with AWS Lambda + API Gateway
"""
from mangum import Mangum
from main import app

# Mangum handler for AWS Lambda
handler = Mangum(app, lifespan="off")

# This is the entry point that Lambda will call
def lambda_handler(event, context):
    """
    Lambda handler function that AWS will invoke.
    
    Args:
        event: API Gateway event (contains request data)
        context: Lambda context object
    
    Returns:
        Response formatted for API Gateway
    """
    return handler(event, context)
