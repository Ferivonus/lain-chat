// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { editAccount } from '../../../services/api';  // Import editAccount function from your API file
import './UserProfile.css';  // Import the CSS for styling

const UserProfile = ({ token }) => {
  const [user, setUser] = useState({ username: '', bio: '', picture: '' });
  const [bio, setBio] = useState('');
  const [picture, setPicture] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user-info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
        setBio(data.bio);
        setPicture(data.picture);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    
    fetchUserInfo();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const updatedUser = await editAccount(bio, picture, token);
      setUser(updatedUser);  
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <img src={user.picture || 'default-profile.png'} alt="Profile" className="profile-picture" />
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Bio:</strong> {user.bio}</p>

      <h3>Edit Profile</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Bio:
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <label>
          Picture URL:
          <input
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="Enter picture URL"
          />
        </label>
        <button type="button" onClick={handleUpdate}>Save Changes</button>
      </form>
    </div>
  );
};

export default UserProfile;
