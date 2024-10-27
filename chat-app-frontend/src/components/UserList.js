import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get('http://localhost:5000/api/auth/users');
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  return (
    <div className="list-group">
      <h4>Users</h4>
      {users.map(user => (
        <button
          key={user._id}
          className="list-group-item list-group-item-action"
          onClick={() => onSelectUser(user)}
        >
          {user.username}
        </button>
      ))}
    </div>
  );
};

export default UserList;
