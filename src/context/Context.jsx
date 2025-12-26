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
                    try {
                        const flightData = await searchFlights(
                            flightParams.origin,
                            flightParams.destination,
                            flightParams.departureDate,
                            flightParams.returnDate,
                            flightParams.adults
                        );
                        
                        if (flightData && flightData.success && flightData.data.amadeusRawJson.data.length > 0) {
                            const offers = flightData.data.amadeusRawJson.data.slice(0, 3); // Top 3
                            let offersHtml = "<h3>Found Flights:</h3>";
                            
                            offers.forEach((offer, index) => {
                                const price = `${offer.price.currency} ${offer.price.grandTotal}`;
                                const segments = offer.itineraries[0].segments;
                                const carrier = segments[0].carrierCode; // Simplification
                                const duration = offer.itineraries[0].duration.replace('PT', '').toLowerCase();
                                
                                offersHtml += `
                                    <div class="flight-offer" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
                                        <strong>Option ${index + 1}</strong><br/>
                                        Price: ${price}<br/>
                                        Duration: ${duration}<br/>
                                        Airline: ${carrier}
                                    </div>
                                `;
                            });
                            response = offersHtml;
                        } else {
                            response = "I searched for flights but couldn't find any available options for those dates/routes.";
                        }
                    } catch (err) {
                        console.error("Flight search error", err);
                        response = "I encountered an error while searching for flights. Please try again later.";
                    }
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
        extended,
        setExtended
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;
