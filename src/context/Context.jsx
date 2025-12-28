import {createContext, useState} from "react";
import { runBedrockChat, extractFlightParamsBedrock } from "../api/bedrock";
import { searchFlights } from "../api/amadeus";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [extended, setExtended] = useState(false);
    const [flightSearchParams, setFlightSearchParams] = useState(null);

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        try {
            // Determine the question to ask
            const promptToSend = prompt !== undefined ? prompt : input;
            
            setPrevPrompts(prev => [...prev, promptToSend]);
            setRecentPrompt(promptToSend);

            // 1. Analyze for Flight Params (Using Python/Bedrock Backend)
            // Note: The python backend should be running on localhost:8000
            const flightParams = await extractFlightParamsBedrock(promptToSend);
            
            if (flightParams) {
                // If it is a flight intent, trigger navigation directly
                setFlightSearchParams(flightParams);
                setLoading(false);
                setInput("");
                return;
            } else {
                // 2. Otherwise, treat as normal chat (Using Python/Bedrock Backend)
                response = await runBedrockChat(promptToSend);
            }

            // Simple formatting for the response
            let responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>"
                }

            }
            let newResponse2 = newResponse.split("*").join("</br>");
            let newResponseArray = newResponse2.split(" ");
            for (let i = 0; i < newResponseArray.length; i++) {
                const nextWord = newResponseArray[i];
                delayPara(i, nextWord + " ");
            }
        } catch (error) {
            console.error("Error fetching chat response:", error);
            setResultData("Error connecting to AI Backend. Is the Python server running?");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        extended,
        setExtended,
        flightSearchParams,
        setFlightSearchParams
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
