import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Massangers.css';

const Messengers = () => {
    const [usernames, setUsernames] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        const fetchUsernames = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/username');
                setUsernames(response.data);
            } catch (error) {
                console.error('Error fetching usernames:', error);
            }
        };
        fetchUsernames();

        // Get initially selected user from localStorage
        const storedReceiver = localStorage.getItem('selectedReceiver');
        if (storedReceiver) {
            setSelectedUser(storedReceiver);
        }
    }, []);

    const handleUserClick = (username) => {
        setSelectedUser(username);
        localStorage.setItem('selectedReceiver', username);
        // Optionally, you can trigger any callback or state update here
    };

    return (
        <div className="messenger-container">
            <div className="messenger-header">
                <h2 className="messenger-title">Messengers</h2>
            </div>
            <ul className="messenger-list">
                {usernames.map((username, index) => (
                    <li 
                        key={index} 
                        className={`messenger-item ${selectedUser === username ? 'selected' : ''}`}
                        onClick={() => handleUserClick(username)}
                    >
                        <div className="messenger-avatar">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <span className="messenger-username">{username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Messengers;