// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust the base URL as needed

// Function to register a user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response;
};

// Function to log in a user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response;
};

// Function to get the list of users
export const getUsers = async (query) => {
  const response = await axios.get(`http://localhost:5000/api/auth/users?query=${query}`);
  return response;
};

// Function to get messages between two users
export const getMessages = async (sender, receiver) => {
  const response = await axios.get(`http://localhost:5000/api/messages/${sender}/${receiver}`);
  return response;
};
