import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessageForm.css';

const MessageForm = () => {
    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get sender from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username) {
            setSender(storedUser.username);
        }

        // Get receiver from localStorage
        const selectedReceiver = localStorage.getItem('selectedReceiver');
        if (selectedReceiver) {
            setReceiver(selectedReceiver);
        }
    }, []);

    // Add a new useEffect to listen for changes in localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const selectedReceiver = localStorage.getItem('selectedReceiver');
            if (selectedReceiver) {
                setReceiver(selectedReceiver);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!receiver) {
            setError('Please select a receiver first');
            return;
        }

        setLoading(true);
        setError('');

        const payload = { sender, receiver, message };
        console.log('Payload:', payload);

        try {
            const response = await axios.post('http://localhost:5000/api/messages', payload);
            console.log('Response:', response.data);
            setMessage('');
            // Keep the receiver as is since it's selected from the messenger list
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send the message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-form">
            {error && <p className="error">{error}</p>}
            
            <div className="input-bar">
                <textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" disabled={loading || !receiver}>
                    {loading ? '...' : 'Send'}
                </button>
            </div>
        </form>
    );
};

export default MessageForm;