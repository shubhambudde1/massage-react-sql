import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Import the CSS file

const SignUp = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setMessage(''); // Clear previous messages on input change
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/signup', formData);
            setMessage(response.data.message);
            setFormData({ username: '', email: '', password: '' });
            if (response.status === 201) {
                // Redirect to the Sign In page
                navigate('/signin');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to sign up');
        }
    };

    return (
        <>
         <div className="welcome-container">
            <div className="welcome-content">
                <h1>Welcome to ChatApp</h1>
                <p className="welcome-description">
                    Connect with friends, family, and colleagues in real-time. Start chatting now!
                </p>
                
            </div>
        </div>


        <form onSubmit={handleSubmit} className="signup-container">
    <h2>Sign Up</h2>
    {message && <p className="message text-green-500">{message}</p>}
    {error && <p className="message text-red-500">{error}</p>}
    <div>
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            />
    </div>
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
    <button type="submit">Sign Up</button>
    <p>
        Already have an account? <a href="/signin">Sign In</a>
    </p>
</form>
            </>
    );
};

export default SignUp;
