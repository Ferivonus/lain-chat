import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { sendMessageToRoom } from '../../../services/api';
import Cookies from 'js-cookie';

const socket = io('http://localhost:5004');

function GroupChat() {
  const { groupName } = useParams();
  const [GroupNameSaved, setGroupName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('Username not found. Please log in.');
    }

    if (groupName) {
      console.log('groupName data type:', typeof groupName);  // groupName'in veri tipini yazdır
      setGroupName(String(groupName));  // groupName'i string'e çevirip set et
    } else {
      console.error('Group name not found. Please fix it.');
    }

    if (groupName) {
      socket.emit('joinRoom', groupName);

      // Listen for incoming messages with username included
      socket.on('chatMessage', (msgData) => {
        setMessages((prevMessages) => [...prevMessages, msgData]);
      });
    }

    // Cleanup on component unmount
    return () => {
      socket.off('chatMessage');
      socket.off('message');
    };
  }, [groupName]);

  const handleSendMessage = () => {
    if (message.trim()) {
      SaveMessageToMongoDB();
      socket.emit('chatMessage', { room: GroupNameSaved, message, username }); // Send both message and username
      setMessage('');
    }
  };

  const SaveMessageToMongoDB = async () => {
    try {
      console.log({ roomId:GroupNameSaved, message, username });

      await sendMessageToRoom(GroupNameSaved,  message, username);
    } catch (err) {
      console.error('Failed to save message. Please try again.');
    }
  };

  return (
    <div className="GroupChat">
      <h2>Group Chat: {groupName}</h2>
      <div className="messages">
        {messages.map((msgData, index) => (
          <div key={index}>
            <strong>{msgData.username}:</strong> {msgData.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default GroupChat;
