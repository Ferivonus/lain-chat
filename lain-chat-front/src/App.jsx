import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatHome from './components/Chat-room/Chat-home/ChatHome';
import GroupChat from './components/Chat-room/Group-chat/GroupChat';
import PrivateChat from './components/Chat-room/Private-chat/PrivateChat';
import UserProfile from './components/user/UserProfile/UserProfile'
import ProtectedRoute from './protections/ProtectedRoute';

// Importing the CSS file for styling
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar" aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link" aria-label="Go to Home page">Home</Link>
            </li>
            <li>
              <Link to="/login" className="nav-link" aria-label="Go to Login page">Login</Link>
            </li>
            <li>
              <Link to="/register" className="nav-link" aria-label="Go to Register page">Register</Link>
            </li>
            <li>
              <Link to="/chat-home" className="nav-link" aria-label="Go to Chat Home">Chat Home</Link>
            </li>
          </ul>
        </nav>


        <h1 className="app-title">Chat App</h1>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />} />

          <Route 
            path="/chat-home" 
            element={
              <ProtectedRoute>
                <ChatHome />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/group-chat/:groupName" 
            element={
              <ProtectedRoute>
                <GroupChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/private-chat/:privateUsername"
            element={
              <ProtectedRoute>
                <PrivateChat />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<UserProfile />} />  {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
