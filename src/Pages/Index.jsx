import React from 'react';
import Form from '../components/Form';

const Index = ({ onSubmit }) => {
    return (
        <div className="page-content">
            <h1>Welcome to Fresh Farm Produce</h1>
            <Form onSubmit={onSubmit} />
        </div>
    );
};

export default Index;