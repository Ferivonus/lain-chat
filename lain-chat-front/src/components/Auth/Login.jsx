import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import Cookies from 'js-cookie';  // Import js-cookie

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Pass username and password as an object
      const response = await loginUser({ username, password });
      
      // Save the token, username, and password in cookies
      Cookies.set('token', response.token, { expires: 1 });  // Token'ı çerezlere kaydet (1 gün süreyle)
      Cookies.set('username', username, { expires: 1 });  // Kullanıcı adını çerezlere kaydet
      Cookies.set('password', password, { expires: 1 });  // Parolayı çerezlere kaydet
      
      // Redirect to the homepage
      navigate('/');  // Ana sayfaya yönlendir
    } catch (err) {
      setError('Giriş başarısız, tekrar deneyin.');
    }
  };

  return (
    <div>
      <h1>Giriş Yap</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
