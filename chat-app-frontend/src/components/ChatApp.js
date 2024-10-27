import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import UserList from './UserList';
import { fetchUsers } from '../api'; // Create a function to fetch users from your backend

const ChatApp = ({ user }) => {
  const [receiver, setReceiver] = useState(null);
  const [users, setUsers] = useState([]); // State to hold the list of users

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers(); // Assume this function fetches the list of users
        setUsers(response.data);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Chat Application</h3>
      <div className="row">
        <div className="col-md-4">
          <UserList users={users} onSelectUser={setReceiver} /> {/* Pass the user selection handler */}
        </div>
        <div className="col-md-8">
          {receiver && <Chat user={user} receiver={receiver} />} {/* Render the chat only if a receiver is selected */}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
