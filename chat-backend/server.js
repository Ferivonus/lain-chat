const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/AuthRoutes');

//room management
const PublicChatRoomRoutes = require('./routes/Room Routes/Room Management/PublicChatRoomRoutesManagement');
const PrivateChatRoomRoutes = require('./routes/Room Routes/Room Management/PrivateRoomRoutesManagement');
//Room get set
const PrivateChatRoom = require('./routes/Room Routes/Room GetSet/PrivateMessagesRoutesGetSet');
const PublicChatRoom = require('./routes/Room Routes/Room GetSet/PublicMessageRoutesGetSet');
//p2p management and get set
const p2pChatRoom = require('./routes/p2p/P2p Management/P2pChatRoomManagement');
const p2pChatRoomgetset = require('./routes/p2p/p2p Message GetSet/p2pMessgeGetSetRoutes');

require('dotenv').config();

const apiPort = process.env.API_PORT || 5000; 
const socketPort = process.env.SOCKET_PORT || 5004; 

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Authentication Routes
app.use('/api/auth', authRoutes);        

// Management Routes
app.use('/api/publicChatRoom/management', PublicChatRoomRoutes);
app.use('/api/privateChatRoom/management', PrivateChatRoomRoutes);
app.use('/api/p2pChatRoom/management', p2pChatRoom);

// Get/Set Routes
app.use('/api/privateMessages/get-set', PrivateChatRoom);
app.use('/api/roomMessages/get-set', PublicChatRoom);
app.use('/api/p2pChatRoom/get-set', p2pChatRoomgetset);

console.log('DB URI:', process.env.DB_URI);  

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

connectDB();

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
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinRoom', (room) => {
        socket.join(room);  
        console.log(`User joined room: ${room}`);
        socket.emit('message', `You have joined the room: ${room}`);
    });

    socket.on('chatMessage', (msgData) => {
      const { room, message, username } = msgData;
      if (!room || !message || !username) {
        return socket.emit('error', 'Room, message, and username are required.');
      }
      io.to(room).emit('chatMessage', { message, username });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        io.emit('message', 'A user has left the chat');
    });

    socket.on('error', (err) => {
        console.log('Socket.IO error:', err);
    });
});

server.listen(socketPort, () => {
  console.log(`Socket.IO Server running on port ${socketPort}`);
});
