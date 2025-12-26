
/**
 * API function to talk to the Python Backend (Bedrock)
 */
export const runBedrockChat = async (prompt) => {
    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });
        
        if (!response.ok) throw new Error("Backend error");
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Bedrock Chat Error:", error);
        throw error;
    }
};

export const extractFlightParamsBedrock = async (prompt) => {
    try {
        const response = await fetch('http://localhost:8000/api/analyze-flight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data.params;
    } catch (error) {
        console.error("Bedrock Extraction Error:", error);
        return null;
    }
};
