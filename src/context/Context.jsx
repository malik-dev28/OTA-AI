import {createContext, useState} from "react";
import runChat, { extractFlightParams } from "../config/gemini";
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
            if (prompt !== undefined) {
                response = await runChat(prompt);
                setRecentPrompt(prompt);
            } else {
                setPrevPrompts(prev => [...prev, input]);
                setRecentPrompt(input);
                
                // Check if it's a flight request
                const flightParams = await extractFlightParams(input);
                
                if (flightParams) {
                    setFlightSearchParams(flightParams);
                    setLoading(false);
                    setInput("");
                    return;
                } else {
                    response = await runChat(input);
                }
            }

            // Normal Gemini formatting if it's not HTML already (flight results are parsing as HTML string)
            // But verify if response is the flight HTML or Gemini markdown text.
            
            // If response starts with <, treat as HTML, else format markdown
            if (response.trim().startsWith("<")) {
                setResultData(response);
                setLoading(false);
                setInput("");
                return; 
            }

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
            setResultData("Error fetching response. Please try again.");
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
