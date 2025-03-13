import React from 'react';
const FarmSales = ({ formData, aiAnalysis }) => {
    return (
        <div className="page-content">
            <h2>Farm Sales Data</h2>
            {formData ? (
                <>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Message:</strong> {formData.message}</p>
                </>
            ) : (
                <p>No data submitted yet.</p>
            )}
            
            <h3>AI Analysis</h3>
            {aiAnalysis ? <p>{aiAnalysis}</p> : <p>No analysis available.</p>}
        </div>
    );
};

export default FarmSales;