export const searchFlights = async (origin, destination, departureDate, returnDate = null, adults = 1) => {
    const url = process.env.AMADEUS_API_URL;
    const token = process.env.AMADEUS_API_TOKEN;

    const originDestinations = [
        {
            departure: {
                airportCode: origin,
                date: departureDate
            },
            arrival: {
                airportCode: destination
            }
        }
    ];

    if (returnDate) {
        originDestinations.push({
            departure: {
                airportCode: destination,
                date: returnDate
            },
            arrival: {
                airportCode: origin
            }
        });
    }

    const body = {
        originDestinations: originDestinations,
        travellers: {
            adt: adults,
            chd: 0,
            inf: 0
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Returns the full response object
    } catch (error) {
        console.error("Flight search failed:", error);
        throw error;
    }
};
