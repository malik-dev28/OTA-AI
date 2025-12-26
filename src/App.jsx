import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Main from "./components/Main/Main.jsx";
import FlightResults from './pages/FlightResults/FlightResults';

const App = () => {
    return (
        <Router>
            <Sidebar/>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/flights" element={<FlightResults />} />
            </Routes>
        </Router>
    )
}

export default App;