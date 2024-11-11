// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    // Pass the data as an object
    await registerUser({ username, password });
    navigate('/login');  // Kayıt sonrası login sayfasına yönlendir
  } catch (err) {
    setError('Kayıt başarısız, tekrar deneyin.');
  }
};

  return (
    <div>
      <h1>Kayıt Ol</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;
