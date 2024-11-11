const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const messageRoutes = require('./routes/messageRoutes');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

require('dotenv').config();
const apiPort = process.env.MONGODB_PORT || 5000; // API server portu
const socketPort = process.env.SOCKET_PORT || 5004; // Socket.IO server portu

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// API rotaları
app.use('/api/messages', messageRoutes);  // Mesajlarla ilgili API
app.use('/api/auth', authRoutes);        // Login ve Register API
app.use('/api/rooms', roomRoutes);       // Yeni 'rooms' API

// MongoDB bağlantısı
const uri = process.env.DB_URI;  // Fetch the DB_URI from environment variables

console.log('DB URI:', uri);  // Log the URI to ensure it's loaded properly

mongoose.connect(uri)
  .then(() => console.log('MongoDB veritabanına bağlanıldı'))
  .catch(err => {
    console.log('MongoDB bağlantı hatası:', err);
    process.exit(1);  // Stop the app if there's a DB connection issue
  });

app.get('/', (req, res) => {
    res.send('Socket.IO and MongoDB Server is running');
});

// API server'ını başlatıyoruz
app.listen(apiPort, () => {
  console.log(`API Server running on port ${apiPort}`);
});

// Socket.IO server'ını 5004 portunda başlatıyoruz
const server = http.createServer(); // Socket.IO server için yeni bir HTTP server'ı oluşturuyoruz
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // React frontend'iniz hangi portta çalışıyorsa buraya onu yazın
    methods: ["GET", "POST"]
  }
});

// Odaya mesaj göndermek için event
io.on('connection', (socket) => {
    console.log('New user connected');

    // Kullanıcı bir odaya katıldığında
    socket.on('joinRoom', (room) => {
        socket.join(room);  // Kullanıcı belirli bir odaya katılır
        console.log(`User joined room: ${room}`);
        socket.emit('message', `You have joined the room: ${room}`);
    });

    // Odaya mesaj gönderildiğinde
    socket.on('chatMessage', (data) => {
        const { room, message } = data;
        io.to(room).emit('chatMessage', message);  // Oda içindeki tüm kullanıcılara mesaj gönder
    });

    // Bağlantı kesildiğinde
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('error', (err) => {
        console.log('Socket.IO error:', err);
    });
});

// Socket.IO server'ını 5004 portunda başlatıyoruz
server.listen(socketPort, () => {
  console.log(`Socket.IO Server running on port ${socketPort}`);
});
