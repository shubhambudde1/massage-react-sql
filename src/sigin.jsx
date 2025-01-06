import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signIn.css';

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending data:", formData);
        try {
            const response = await axios.post('http://localhost:5000/api/signin', formData);
            
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage(response.data.message);
            if (response.status === 200) {
                navigate('/Messages'); // Correct redirect to the dashboard or main page
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to sign in');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signin-container">
    <h2>Sign In</h2>
    {message && <p className="message text-blue-500">{message}</p>}
    <div>
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
        />
    </div>
    <div>
        <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
        />
    </div>
    <button type="submit">Sign In</button>
</form>
    );
};

export default SignIn;

