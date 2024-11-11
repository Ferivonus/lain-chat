import axios from 'axios';


export const SaveMessage = async (roomId, message, username) => {
  try {
    const response = await axios.post('http://localhost:5000/api/messages/send', {  
      roomId: roomId,
      message: message,
      username: username, 
    });
    console.log('Message successfully sent to the API:', response.data);
  } catch (error) {
    console.error('Error sending message to the API:', error);
  }
};

export const getMessageRoom = async (roomId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/messages/${roomId}`);
    console.log('Fetched messages:', response.data.messages);
    return response.data.messages;
  } catch (error) {
    console.error('Error fetching messages from API:', error);
    return [];  
  }
};

const AUTH_API_URL = 'http://localhost:5000/api/auth';  

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    return response.data; 
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data; 
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

const ROOM_API_URL = 'http://localhost:5000/api/rooms';  


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

export const fetchRooms = async () => {
    try {
        const response = await axios.get(ROOM_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

