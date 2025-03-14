import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Index from './Pages/Index';
import FarmSales from './Pages/FarmSales';
import { submitFormData, fetchFarmSales } from './api'; // Import your API functions
import './App.css';

axios.defaults.baseURL = "http://localhost:8021/";

const App = () => {
    const [formData, setFormData] = useState(null);
    const [farmSales, setFarmSales] = useState([]); // State to hold fetched farm sales data

    const handleFormSubmit = async (data) => {
        setFormData(data);
        try {
            await submitFormData(data); // Call the API function to submit data
            // Optionally fetch farm sales after submission
            const fetchedData = await fetchFarmSales();
            setFarmSales(fetchedData);
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <Router>
            <Navbar />
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Index onSubmit={handleFormSubmit} />} />
                    <Route path="/FarmSales" element={<FarmSales formData={formData} farmSales={farmSales} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;