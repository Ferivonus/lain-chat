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

app.use('/api/messages', messageRoutes);  
app.use('/api/auth', authRoutes);        
app.use('/api/rooms', roomRoutes);       

const uri = process.env.DB_URI;  

console.log('DB URI:', uri);  

mongoose.connect(uri)
  .then(() => console.log('MongoDB veritabanına bağlanıldı'))
  .catch(err => {
    console.log('MongoDB bağlantı hatası:', err);
    process.exit(1);  
  });

app.get('/', (req, res) => {
    res.send('Socket.IO and MongoDB Server is running');
});

app.listen(apiPort, () => {
  console.log(`API Server running on port ${apiPort}`);
});

const server = http.createServer(); 
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);  
        console.log(`User joined room: ${room}`);
        socket.emit('message', `You have joined the room: ${room}`);
    });

    socket.on('chatMessage', (data) => {
        const { room, message } = data;
        io.to(room).emit('chatMessage', message);  
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('error', (err) => {
        console.log('Socket.IO error:', err);
    });
});

server.listen(socketPort, () => {
  console.log(`Socket.IO Server running on port ${socketPort}`);
});
