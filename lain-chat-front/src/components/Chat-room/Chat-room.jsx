import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import js-cookie
import io from 'socket.io-client';
import { SaveMessage, getMessageRoom } from '../../services/api';

// Backend sunucusunun adresi
const socket = io('http://localhost:5004');  // Backend portu 4000

function ChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const { room: roomParam } = useParams();  // URL parametresindeki oda ismi
  const [username, setUsername] = useState('');  // Kullanıcı adı için state

  const navigate = useNavigate();  // Kullanıcıyı yönlendirecek

  useEffect(() => {

    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('Kullanıcı adı bulunamadı. Giriş yapmayı unutmayın.');
    }

    if (roomParam && roomParam !== currentRoom) {
      setCurrentRoom(roomParam);  // Odayı belirle
      setMessages([]);  // Eski mesajları temizle
    }

    // Sunucudan gelen mesajları dinleyin
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('message', (msg) => {
      alert(msg);  // Kullanıcıya odaya katıldığını bildiren mesaj
    });

    return () => {
      socket.off('chatMessage');
      socket.off('message');
    };
  }, [roomParam, currentRoom]);

  const handleSendMessage = async () => {
    if (message && currentRoom) {
      SaveMessageMongoDB();
      socket.emit('chatMessage', { room: currentRoom, message });
      setMessage('');
    }
  };

  const SaveMessageMongoDB = async () => {
    try{
        await SaveMessage({ currentRoom, message, username });
      }
      catch (err) {
        console.error('Kayıt başarısız, tekrar deneyin.');
      }
  }

  const handleJoinRoom = () => {
    if (room) {
      socket.emit('joinRoom', room);  // Odaya katılmak için
      setCurrentRoom(room);  // Hangi odada olduğumuzu kaydet
      setMessages([]);  // Yeni odaya geçerken eski mesajları temizleyin
      setRoom('');  // Oda inputunu temizle
      navigate(`/chat/${room}`);  // URL'yi dinamik olarak değiştir
    }
  };

  return (
    <div className="ChatRoom">
      <h1>Chat Room</h1>

      {/* Odaya katılmak için alan */}
      {!currentRoom && (
        <div>
          <input
            type="text"
            placeholder="Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      )}

      {/* Odaya katıldıysa mesajlaşma alanı */}
      {currentRoom && (
        <div>
          <h2>Room: {currentRoom}</h2>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>

          {/* Mesaj gönderme */}
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
