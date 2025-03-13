import React, { useState } from 'react';

const Form = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = 'Name is required';
        if (!formData.email) tempErrors.email = 'Email is required';
        if (!formData.message) tempErrors.message = 'Message is required';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            setFormData({ name: '', email: '', message: '' }); // Reset form
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
                <div className="container">
                    <label className='text'>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <div className="container">
                    <label className='text'>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div className="container">
                    <label className='text'>Message:</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} className="input"></textarea>
                    {errors.message && <span>{errors.message}</span>}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Form;