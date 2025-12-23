import React, { useContext, useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from "../../assets/assets.js";
import { Context } from "../../context/Context.jsx";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, extended, setExtended } = useContext(Context);
    const resultRef = useRef(null);
    
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        setIsDarkMode(dark);
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [resultData]);

    const suggestionCards = [
        {
            text: "NYC to LAX on Christmas",
            iconClass: "ri-plane-fill",
            prompt: "Search flights from New York to Los Angeles on December 25, 2025"
        },
        {
            text: "London to Paris – New Year deals",
            iconClass: "ri-money-dollar-circle-line",
            prompt: "Find flight deals from London to Paris for New Year's, 2 passengers"
        },
        {
            text: "Romantic weekend escape",
            iconClass: "ri-heart-3-line",
            prompt: "Suggest a romantic getaway destination for a couple"
        },
        {
            text: "Budget solo travel 2026",
            iconClass: "ri-compass-discover-line",
            prompt: "Best budget destinations for solo travelers in 2026"
        }
    ];

    const handleSuggestionClick = (prompt) => {
        setInput(prompt);
        onSent();
    };

    return (
        <main className="main">
            <nav className="nav">
                <div className="nav-left">
                     <i 
                        className="ri-menu-line mobile-menu-toggle" 
                        onClick={() => setExtended(prev => !prev)}
                     ></i>
                    <p>OTA Travel App</p>
                </div>
                <div className="nav-right">
                    <button 
                        className="theme-toggle" 
                        onClick={toggleDarkMode} 
                        aria-label="Toggle dark mode"
                    >
                        <i className={isDarkMode ? "ri-sun-line" : "ri-moon-line"}></i>
                    </button>
                    <img src={assets.user_icon} alt="User" className="user-avatar"/>
                </div>
            </nav>

            <div className="main-container">
                <div className="chat-area" ref={resultRef}>
                    {!showResult ? (
                        <div className="greet">
                            <p><span>Welcome to OTA Travel</span></p>
                            <p>How can we help with your travel plans today?</p>
                        </div>
                    ) : null}

                    {showResult && (
                        <div className="result">
                            <div className="result-title">
                                <img src={assets.user_icon} alt="You" className="user-avatar-small"/>
                                <p>{recentPrompt}</p>
                            </div>
                            <div className="result-data">
                                <div className="result-data-icon">
                                    <i className="ri-sparkling-fill"></i>
                                </div>
                                {loading ? (
                                    <div className="loader">
                                        <hr/><hr/><hr/>
                                    </div>
                                ) : (
                                    <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Full height suggestions */}
                {!showResult && (
                    <aside className="right-sidebar">
                        <h3 className="right-sidebar-title">Quick Travel Ideas</h3>
                        <div className="suggestions">
                            {suggestionCards.map((card, index) => (
                                <div 
                                    key={index}
                                    className="suggestion-card" 
                                    onClick={() => handleSuggestionClick(card.prompt)}
                                >
                                    <i className={card.iconClass}></i>
                                    <p>{card.text}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}
            </div>

            {/* Chat Input - Fixed bottom */}
            <div className="main-bottom">
                <div className="search-box">
                    <textarea 
                        rows={1}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSent();
                            }
                        }}
                        value={input}
                        placeholder="Ask about flights, hotels, itineraries..."
                        aria-label="Travel question input"
                    />
                    <div className="icon-container">
                        <button aria-label="Attach image">
                            <i className="ri-image-add-line"></i>
                        </button>
                        <button aria-label="Voice input">
                            <i className="ri-mic-line"></i>
                        </button>
                        <button 
                            onClick={() => onSent()}
                            disabled={!input.trim()}
                            aria-label="Send message"
                        >
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                <p className="bottom-info">
                    OTA Travel uses AI to help plan trips. Always verify details with official sources.
                    <a href="#" aria-label="Privacy policy"> Privacy Policy</a>
                </p>
            </div>
        </main>
    );
};

export default Main;