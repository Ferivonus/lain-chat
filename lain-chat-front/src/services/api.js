// src/services/api.js
import axios from 'axios';

// API URL for your backend
const AUTH_API_URL = 'http://localhost:5000/api/auth';  // Adjust this based on your backend URL

// Function to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    return response.data; // Assuming it returns the logged-in user data
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data; // Assuming it returns the newly created user data
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

const ROOM_API_URL = 'http://localhost:5000/api/rooms';  // Adjust the URL if necessary


// Create a new room
export const createRoom = async (room_name, creator_username) => {
    try {
        const response = await axios.post(ROOM_API_URL, {
            room_name,
            creator_username
        });
        return response.data;
    } catch (error) {
        console.error("Error creating room: ", error);
        throw error;
    }
};

// Fetch rooms from the backend
export const fetchRooms = async () => {
    try {
        const response = await axios.get(ROOM_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

// You can add more functions here based on your application's needs

