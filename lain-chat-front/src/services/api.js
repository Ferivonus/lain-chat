import axios from 'axios';

// Management API URLs
const MANAGEMENT_API_URL = 'http://localhost:5000/api/management';
const ROOM_API_URL = `${MANAGEMENT_API_URL}/room`;  // URL for managing rooms
const AUTH_API_URL = `${MANAGEMENT_API_URL}/auth`;  // URL for managing accounts

export const createNewRoom = async (roomName, creatorUsername) => {
  try {
    const response = await axios.post(`${ROOM_API_URL}/create`, {
      room_name: roomName,
      creator_username: creatorUsername,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

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

export const editAccount = async (bio, picture, token) => {
  try {
    const response = await axios.patch(`${AUTH_API_URL}/edit-account`, {
      bio: bio,
      picture: picture
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      console.log('Account successfully updated:', response.data.data);
      return response.data.data;
    } else {
      console.error('Error in response:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};


const GET_SET_API_URL = 'http://localhost:5000/api/get-set';
const PRIVATE_MESSAGE_API_URL = `${GET_SET_API_URL}/privateMessages`;
const GROUP_MESSAGE_API_URL = `${GET_SET_API_URL}/roomMessages`;
const P2P_CHAT_ROOM_API_URL = `${GET_SET_API_URL}/p2pChatRoom`;  // URL for p2p chat rooms

// Send a private message (Get/Set API)
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

// Fetch all private messages for a specific chat (Get/Set API)
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

// Send a message to a specific room (Get/Set API)
export const sendMessageToRoom = async (roomId, message, username) => {
  try {
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

// Fetch messages from a specific room (Get/Set API)
export const fetchMessagesFromRoom = async (roomId) => {
  try {
    const response = await axios.get(`${GROUP_MESSAGE_API_URL}/${roomId}`);
    if (response.data.success) {
      console.log('Fetched messages for room:', response.data.data);
      return response.data.data;
    } else {
      console.error('Error in response:', response.data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching messages from room:', error);
    return [];
  }
};

// Fetch all rooms (Get/Set API)
export const fetchAllRooms = async () => {
  try {
    const response = await axios.get(ROOM_API_URL);  // Adjusted for Get/Set
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

// Fetch P2P chat room data (Get/Set API)
export const fetchP2PChatRoomData = async (chatId) => {
  try {
    const response = await axios.get(`${P2P_CHAT_ROOM_API_URL}/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching P2P chat room data:', error);
    throw error;
  }
};