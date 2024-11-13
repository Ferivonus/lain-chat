import axios from 'axios';

// API URLs
const AUTH_API_URL = 'http://localhost:5000/api/auth';  
const ROOM_API_URL = 'http://localhost:5000/api/room'; 
const PRIVATE_MESSAGE_API_URL = 'http://localhost:5000/api/privateMessages';
const GROUP_MESSAGE_API_URL = 'http://localhost:5000/api/roomMessages';

// Send a private message
export const sendPrivateMessageToChat = async (chatId, message, username) => {
  try {
    const response = await axios.post(`${PRIVATE_MESSAGE_API_URL}/send`, {
      chatId: chatId,
      message: message,
      username: username,
    });
    if (response.data.success) {
      console.log('Private message sent:', response.data.data);
      return response.data.data;
    } else {
      console.error('Error in response:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error sending private message:', error);
    return null;
  }
};

// Fetch all private messages for a specific chat
export const fetchPrivateMessagesForChat = async (chatId) => {
  try {
    const response = await axios.get(`${PRIVATE_MESSAGE_API_URL}/${chatId}`);
    if (response.data.success) {
      console.log('Fetched private messages:', response.data.data);
      return response.data.data;
    } else {
      console.error('Error in response:', response.data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching private messages:', error);
    return [];
  }
};

// Save a message to a specific room
export const sendMessageToRoom = async (roomId, message, username) => {
  try {
    console.log("room id:", roomId);
    console.log("message: ", message);
    console.log("username: ", username);
    const response = await axios.post(`${GROUP_MESSAGE_API_URL}/send`, {  
      roomId: roomId,
      message: message,
      username: username, 
    });
    console.log('Message successfully sent to the room:', response.data);
  } catch (error) {
    console.error('Error sending message to the room:', error);
  }
};

// Fetch messages from a specific room
export const fetchMessagesFromRoom = async (roomId) => {
  try {
    const response = await axios.get(`${GROUP_MESSAGE_API_URL}/${roomId}`);
    if (response.data.success) {
      console.log('Fetched messages for room:', response.data.data);
      return response.data.data;  // Adjusted to access nested data
    } else {
      console.error('Error in response:', response.data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching messages from room:', error);
    return [];  
  }
};

// User login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    return response.data; 
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// User registration
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data; 
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// Create a new chat room
export const createNewRoom = async (roomName, creatorUsername) => {
  try {
    const response = await axios.post(ROOM_API_URL, {
      room_name: roomName,
      creator_username: creatorUsername
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room: ", error);
    throw error;
  }
};

// Fetch all chat rooms
export const fetchAllRooms = async () => {
  try {
    const response = await axios.get(ROOM_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
