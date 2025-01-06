import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MessageList.css';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const messagesEndRef = useRef(null);
  const [loggedInUser, setLoggedInUser] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Get logged in user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username) {
      setLoggedInUser(storedUser.username);
    }

    // Get selected receiver from localStorage
    const receiver = localStorage.getItem('selectedReceiver');
    if (receiver) {
      setSelectedReceiver(receiver);
    }
  }, []);

  // Listen for changes in selected receiver
  useEffect(() => {
    const handleStorageChange = () => {
      const receiver = localStorage.getItem('selectedReceiver');
      if (receiver) {
        setSelectedReceiver(receiver);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Set up polling to fetch messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filter messages based on selected receiver and logged in user
  const filteredMessages = messages.filter(msg => {
    if (!selectedReceiver) return false;
    return (
      // Show messages where logged in user is sender and selected user is receiver
      (msg.sender === loggedInUser && msg.receiver === selectedReceiver) ||
      // Show messages where selected user is sender and logged in user is receiver
      (msg.sender === selectedReceiver && msg.receiver === loggedInUser)
    );
  });

  return (
    <div className="message-list-container">
      <div className="message-list-scroll">
        {selectedReceiver && (
          <div className="message-header">
            <h3>{selectedReceiver}</h3>
          </div>
        )}
        <ul className="message-list">
          {filteredMessages.length === 0 ? (
            <li className="message-item no-messages">
              No messages in this conversation yet
            </li>
          ) : (
            filteredMessages.map((msg) => (
              <li 
                key={msg.id} 
                className={`message-item ${msg.sender === loggedInUser ? 'sent' : 'received'}`}
              >
                <span className="message-content">{msg.message}</span>
                {/* <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span> */}
              </li>
            ))
          )}
          <div ref={messagesEndRef} />
        </ul>
      </div>
    </div>
  );
};

export default MessageList;