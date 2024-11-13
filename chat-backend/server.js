const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/AuthRoutes');
const PublicChatRoomRoutes = require('./routes/Room Management/PublicChatRoomRoutes');
const PrivateMessageRoutes = require('./routes/Room Send-Get/PrivateMessagesRoutes');
const GroupMessageRoutes = require('./routes/Room Send-Get/PublicMessageRoutes');
const p2pChatRoom = require('./routes/Room Management/P2pChatRoom');
const PrivateChatRoom = require('./routes/Room Send-Get/PrivateMessagesRoutes');
const PublicChatRoom =  require('./routes/Room Send-Get/PublicMessageRoutes');

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

app.use('/api/auth', authRoutes);        
app.use('/api/room', RoomRoutes);
app.use('/api/privateMessages', PrivateMessageRoutes);
app.use('/api/roomMessages', GroupMessageRoutes);

// Room Creates:
app.use('/api/publicChatRoom', PublicChatRoom);
app.use('/api/privateChatRoom', PrivateChatRoom);
app.use('/api/P2PChaRoom', p2pChatRoom);


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
