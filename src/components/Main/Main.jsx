import React, { useContext, useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from "../../assets/assets.js";
import { Context } from "../../context/Context.jsx";

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
    const resultRef = useRef(null);
    
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Sync dark mode with HTML attribute
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

    const handleSearch = () => {
        if (!fromLocation || !toLocation || !departDate) return;

        const formattedDepart = new Date(departDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const formattedReturn = returnDate ? new Date(returnDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : null;

        const searchQuery = `Find flights from ${fromLocation} to ${toLocation} departing on ${formattedDepart}${
            formattedReturn ? ` and returning on ${formattedReturn}` : ''
        } for ${passengers} ${passengers > 1 ? 'passengers' : 'passenger'}`;

        setInput(searchQuery);
        onSent();
    };

    // Handle Enter key in any input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <main className="main">
            <nav className="nav">
                <p>OTA Travel App</p>
                <div className="nav-right">
                    {/* Dark Mode Toggle */}
                    <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
                        <img 
                            src={isDarkMode ? assets.sun_icon || assets.bulb_icon : assets.moon_icon || assets.setting_icon} 
                            alt={isDarkMode ? "Light mode" : "Dark mode"} 
                        />
                    </button>
                    <img src={assets.user_icon} alt="User" className="user-avatar"/>
                </div>
            </nav>

            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Welcome to OTA Travel</span></p>
                            <p>How can we help with your travel plans today?</p>
                        </div>

                        <div className="cards">
                            <div className="card" onClick={() => {
                                setFromLocation('New York');
                                setToLocation('Los Angeles');
                                setDepartDate('2025-12-25');
                                setReturnDate('');
                                setPassengers(1);
                                handleSearch();
                            }}>
                                <p>Search flights from NYC to LAX on Christmas</p>
                                <img src={assets.compass_icon} alt=""/>
                            </div>
                            <div className="card" onClick={() => {
                                setFromLocation('London');
                                setToLocation('Paris');
                                setDepartDate('2026-01-01');
                                setReturnDate('2026-01-05');
                                setPassengers(2);
                                handleSearch();
                            }}>
                                <p>Find deals from London to Paris for New Year</p>
                                <img src={assets.bulb_icon} alt=""/>
                            </div>
                            <div className="card" onClick={() => {
                                setInput("Suggest a romantic getaway destination for a couple");
                                onSent();
                            }}>
                                <p>Plan a romantic weekend escape</p>
                                <img src={assets.message_icon} alt=""/>
                            </div>
                            <div className="card" onClick={() => {
                                setInput("Best budget destinations for solo travelers in 2026");
                                onSent();
                            }}>
                                <p>Best budget destinations for solo travelers</p>
                                <img src={assets.code_icon} alt=""/>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="result" ref={resultRef}>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="You"/>
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img className="result-data-icon" src={assets.gemini_icon} alt="OTA Travel"/>
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

                {/* Flight Search Bar */}
                <div className="main-bottom">
                    <div className="search-box flight-search">
                        <div className="input-group">
                            <label>From</label>
                            <input
                                type="text"
                                placeholder="e.g., NYC, London, Tokyo"
                                value={fromLocation}
                                onChange={(e) => setFromLocation(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="input-group">
                            <label>To</label>
                            <input
                                type="text"
                                placeholder="e.g., LAX, Paris, Dubai"
                                value={toLocation}
                                onChange={(e) => setToLocation(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="input-group">
                            <label>Depart</label>
                            <input
                                type="date"
                                value={departDate}
                                onChange={(e) => setDepartDate(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="input-group">
                            <label>Return (optional)</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="input-group passengers-group">
                            <label>Passengers</label>
                            <input
                                type="number"
                                min="1"
                                max="9"
                                value={passengers}
                                onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                                onKeyDown={handleKeyPress}
                            />
                        </div>

                        <div className="icon-container">
                            <button 
                                onClick={handleSearch}
                                disabled={!fromLocation || !toLocation || !departDate}
                                className="search-btn"
                            >
                                <img src={assets.send_icon} alt="Search flights"/>
                            </button>
                        </div>
                    </div>

                    <p className="bottom-info">
                        Flight prices and availability may change. Always verify with airlines.
                        <a href="#"> Privacy Policy</a>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Main;