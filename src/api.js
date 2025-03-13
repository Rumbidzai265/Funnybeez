import axios from 'axios';

const API_URL = "http://localhost:8021/api/";

// Function to submit form data
export const submitFormData = async (formData) => {
    try {
        console.log(`Request URL: ${API_URL}submissions`);
        console.log('Request Payload:', formData);
        const response = await axios.post(`${API_URL}submissions`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', response);
        return response.data;
    } catch (error) {
        console.error("Error submitting form data:", error);
        throw error;
    }
};

// Function to fetch submissions
export const fetchFarmSales = async () => {
    try {
        console.log(`Fetching farm sales from: ${API_URL}submissions`);
        const response = await axios.get(`${API_URL}submissions`);
        console.log('Fetched farm sales:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching farm sales data:", error);
        throw error;
    }
};