# Setting up AWS Bedrock for Your OTA App

## 1. Create an AWS Account
If you don't have one, sign up at [aws.amazon.com](https://aws.amazon.com/). You will need a credit card for verification, even for the free tier.

## 2. Enable Amazon Bedrock Models
1.  Log in to the **AWS Console** and search for **Amazon Bedrock**.
2.  In the left sidebar, click **Model access**.
3.  Click the orange **Enable specific models** (or "Modify model access") button.
4.  Look for **Anthropic** and check **Claude 3.5 Sonnet** (or the latest available version).
5.  Click **Next** and **Submit**. It may take a few minutes to grant access.

## 3. Create an IAM User for the Application
Failed API calls? It's usually permissions.
1.  Search for **IAM** in the AWS Console.
2.  Go to **Users** -> **Create user**.
3.  Name it `ota-bedrock-agent`.
4.  **Permissions options**: Select "Attach policies directly".
5.  Search for `AmazonBedrockFullAccess` and check it.
6.  Complete the creation.

## 4. Generate Access Keys
1.  Click on the newly created user `ota-bedrock-agent`.
2.  Go to the **Security credentials** tab.
3.  Scroll to **Access keys** and click **Create access key**.
4.  Select **Local code** (or CLI).
5.  **Important**: Copy the `Access Key ID` and `Secret Access Key`. You will not see the secret again.

## 5. Configure Your Backend
1.  Navigate to the `backend` folder in this project.
2.  Create a `.env` file (copy from `.env.example`).
3.  Paste your keys:
    ```env
    AWS_ACCESS_KEY_ID=AKIA......
    AWS_SECRET_ACCESS_KEY=wJalr......
    AWS_REGION=us-east-1
    ```
    *(Note: Use the region where you enabled the models, usually `us-east-1` or `us-west-2`)*

## 6. Run the Python Backend
1.  Install Python 3.9+ if needed.
2.  Install dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
3.  Start the server:
    ```bash
    uvicorn main:app --reload
    ```
4.  Your backend is now running at `http://localhost:8000`.
