import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatRoom from './components/Chat-room/Chat-room';
import ProtectedRoute from './protections/ProtectedRoute'; // Import ProtectedRoute

// Importing the CSS file for styling
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Menu */}
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li>
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li>
              <Link to="/register" className="nav-link">Register</Link>
            </li>
            <li>
              <Link to="/room" className="nav-link">Chat Room</Link>
            </li>
          </ul>
        </nav>

        {/* Main Title */}
        <h1 className="app-title">Chat App</h1>

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/room"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:roomId" // Ensure you're passing roomId as a URL parameter
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
