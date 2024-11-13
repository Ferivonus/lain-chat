// ChatHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatHome() {
  const [groupName, setGroupName] = useState('');
  const [privateUsername, setPrivateUsername] = useState('');
  const navigate = useNavigate();

  const handleJoinGroupChat = () => {
    if (groupName) {
      navigate(`/group-chat/${groupName}`);
    }
  };

  const handleJoinPrivateChat = () => {
    if (privateUsername) {
      navigate(`/private-chat/${privateUsername}`);
    }
  };

  return (
    <div className="ChatHome">
      <h1>Welcome to the Chat App</h1>

      <div>
        <h2>Group Chat</h2>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button onClick={handleJoinGroupChat}>Join Group Chat</button>
      </div>

      <div>
        <h2>Private Chat</h2>
        <input
          type="text"
          placeholder="Enter username for private chat"
          value={privateUsername}
          onChange={(e) => setPrivateUsername(e.target.value)}
        />
        <button onClick={handleJoinPrivateChat}>Join Private Chat</button>
      </div>
    </div>
  );
}

export default ChatHome;
