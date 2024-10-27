// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat = ({ user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`http://localhost:5000/api/auth/users?query=`);
      setAllUsers(response.data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('joinRoom', user.username);
    }

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && receiver) {
      const messageData = { sender: user.username, receiver, content: message };
      socket.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    } else {
      alert("Select a receiver and enter a message.");
    }
  };

  const loadMessages = async () => {
    if (receiver) {
      const response = await axios.get(`http://localhost:5000/api/messages/${user.username}/${receiver}`);
      setMessages(response.data);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Chat</h2>
      <select className="form-select mb-3" onChange={(e) => setReceiver(e.target.value)}>
        <option value="">Select a user</option>
        {allUsers.map((usr) => (
          <option key={usr._id} value={usr.username}>{usr.username}</option>
        ))}
      </select>
      <button className="btn btn-primary mb-3" onClick={loadMessages}>Load Messages</button>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.sender}:</strong> {msg.content}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

