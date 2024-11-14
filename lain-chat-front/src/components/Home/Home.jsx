import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Lain Chat :3</h1>
        <p>Chat with friends, meet new people, and enjoy private conversations in a safe space.</p>
      </header>

      <section className="features">
        <h2>Why Lain Chat?</h2>
        <ul>
          <li><strong>Connect with friends</strong> easily.</li>
          <li><strong>Meet new people</strong> and build your community.</li>
          <li><strong>Private chats</strong> with no logs or data storage.</li>
        </ul>
      </section>

      <section className="current-features">
        <h2>Current Features</h2>
        <p>
          Currently, Lain Chat offers <strong>text-based messaging</strong>, with future updates planned to include video chat.
        </p>
      </section>

      <div className="cta">
        <Link to="/chat-home" className="join-room-button">Join a Room</Link>
      </div>

      <footer className="home-footer">
        <p>Powered by Tor for extra privacy. :3</p>
        <a href="mailto:ferivonus@gmail.com">Contact Us</a>
      </footer>
    </div>
  );
}

export default Home;
