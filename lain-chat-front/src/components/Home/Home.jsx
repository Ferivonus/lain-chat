import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="welcome-title">Welcome to the Chat App</h1>
        <p className="intro-text">
          Enter the world of connections and conversations. Join a room to get started.
        </p>
        <div className="cta">
          <Link to="/room" className="join-button">Join a Room</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
