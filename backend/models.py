from pydantic import BaseModel
from typing import List, Optional

# --- Request Models ---

class Departure(BaseModel):
    airportCode: str
    date: str

class Arrival(BaseModel):
    airportCode: str

class OriginDestination(BaseModel):
    departure: Departure
    arrival: Arrival

class Travellers(BaseModel):
    adt: int
    chd: int = 0
    inf: int = 0

class FlightSearchRequest(BaseModel):
    originDestinations: List[OriginDestination]
    travellers: Travellers

# --- Response / Data Models ---

class Aircraft(BaseModel):
    code: str

class Operating(BaseModel):
    carrierCode: Optional[str] = None
    carrierName: Optional[str] = None

class FlightSegment(BaseModel):
    departure: Departure # Reusing Departure but API response might be slightly different (iataCode vs airportCode)
    arrival: Arrival
    carrierCode: str
    number: str
    aircraft: Aircraft
    operating: Operating
    duration: str
    numberOfStops: int

# Note: The API response 'departure'/'arrival' inside segments uses 'iataCode' and 'at', 
# whereas request uses 'airportCode' and 'date'. 
# We should define separate models if strict validation is needed, 
# but for now this is a structural base.

class Itinerary(BaseModel):
    duration: str
    segments: List[dict] # using dict to avoid strict parsing issues for now

class PriceFee(BaseModel):
    amount: str
    type: str

class Price(BaseModel):
    currency: str
    total: str
    base: str
    grandTotal: str

class FlightOffer(BaseModel):
    type: str
    id: str
    source: str
    numberOfBookableSeats: int
    itineraries: List[Itinerary]
    price: Price
    validatingAirlineCodes: List[str]

class FlightSearchResponse(BaseModel):
    success: bool
    data: dict # Wraps amadeusRawJson
