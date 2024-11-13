import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { sendPrivateMessageToChat } from '../../../services/api';

const socket = io('http://localhost:5004');

function PrivateChat() {
  const { privateUsername } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('Username not found. Please log in.');
    }

    if (privateUsername) {
      socket.emit('joinRoom', privateUsername);

      socket.on('chatMessage', (msgData) => {
        setMessages((prevMessages) => [...prevMessages, msgData]);
      });
    }

    return () => {
      socket.off('chatMessage');
      socket.emit('leaveRoom', privateUsername);
      socket.disconnect();
    };
  }, [privateUsername]);

  const handleSendMessage = async () => {
    if (message.trim() && privateUsername) {
      setLoading(true);
      try {
        await saveMessageToMongoDB();
        socket.emit('chatMessage', { room: privateUsername, message, username });
        setMessage('');
      } catch (err) {
        setError('Failed to send message.');
      } finally {
        setLoading(false);
      }
    }
  };

  const saveMessageToMongoDB = async () => {
    try {
      await sendPrivateMessageToChat(privateUsername, message, username);
    } catch (err) {
      console.error('Failed to save message. Please try again.', err);
      throw err;  // Re-throw to handle in the parent function
    }
  };

  return (
    <div className="PrivateChat">
      <h2>Private Chat with {privateUsername}</h2>
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
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() || !privateUsername || loading}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default PrivateChat;
