import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchFlights } from '../../api/amadeus';
import './FlightResults.css';
import { Context } from '../../context/Context';

const FlightResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setExtended } = useContext(Context);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Params passed from the chat redirect
    const { origin, destination, departureDate, returnDate, adults } = location.state || {};

    useEffect(() => {
        setExtended(false); // Collapse sidebar for more space
        
        if (!origin || !destination || !departureDate) {
            setError("Missing search parameters. Please start a new search from the chat.");
            setLoading(false);
            return;
        }

        const fetchFlights = async () => {
            try {
                setLoading(true);
                const data = await searchFlights(origin, destination, departureDate, returnDate, adults);
                
                if (data && data.data && data.data.amadeusRawJson && data.data.amadeusRawJson.data) {
                    setFlights(data.data.amadeusRawJson.data);
                } else {
                    setFlights([]);
                }
            } catch (err) {
                console.error("Error fetching flights:", err);
                setError("Failed to fetch flight results. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [origin, destination, departureDate, returnDate, adults]);

    const formatDuration = (ptString) => {
        return ptString.replace('PT', '').toLowerCase();
    };

    const formatTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flight-results-page">
            <div className="results-header">
                <button onClick={() => navigate('/')} className="back-btn">
                    <i className="ri-arrow-left-line"></i> Back to Chat
                </button>
                <h2>Flight Results</h2>
                <div className="query-summary">
                    <span>{origin} <i className="ri-arrow-right-line"></i> {destination}</span>
                    <span>• {new Date(departureDate).toLocaleDateString()}</span>
                    <span>• {adults} Adult{adults > 1 ? 's' : ''}</span>
                </div>
            </div>

            <div className="results-container">
                {loading && (
                    <div className="loading-state">
                        <div className="loader"></div>
                        <p>Searching best flights for you...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <i className="ri-error-warning-line"></i>
                        <p>{error}</p>
                        <button onClick={() => navigate('/')}>Try Again</button>
                    </div>
                )}

                {!loading && !error && flights.length === 0 && (
                    <div className="empty-state">
                        <i className="ri-plane-line"></i>
                        <p>No flights found for this route and date.</p>
                        <button onClick={() => navigate('/')}>Search Different Dates</button>
                    </div>
                )}

                {!loading && flights.map((offer) => (
                    <div key={offer.id} className="flight-card">
                        <div className="flight-card-header">
                            <span className="airline">{offer.validatingAirlineCodes[0]}</span>
                            <span className="price">{offer.price.currency} {offer.price.grandTotal}</span>
                        </div>
                        
                        <div className="itineraries">
                            {offer.itineraries.map((itinerary, index) => {
                                const firstSegment = itinerary.segments[0];
                                const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                                
                                return (
                                    <div key={index} className="itinerary-row">
                                        <div className="route-info">
                                            <div className="time-loc">
                                                <span className="time">{formatTime(firstSegment.departure.at)}</span>
                                                <span className="code">{firstSegment.departure.iataCode}</span>
                                            </div>
                                            <div className="duration-line">
                                                <span>{formatDuration(itinerary.duration)}</span>
                                                <div className="line"></div>
                                                <span>{itinerary.segments.length - 1} Stop{(itinerary.segments.length - 1) !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="time-loc">
                                                <span className="time">{formatTime(lastSegment.arrival.at)}</span>
                                                <span className="code">{lastSegment.arrival.iataCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="flight-card-footer">
                            <span className="seats">{offer.numberOfBookableSeats} seats left</span>
                            <button className="book-btn">Book Flight</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightResults;
