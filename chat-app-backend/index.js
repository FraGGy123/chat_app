// index.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Middleware setup
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO for real-time communication
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (userId) => {
        socket.join(userId);
    });

    socket.on('sendMessage', async (messageData) => {
        const { sender, receiver, content } = messageData;
        const Message = require('./models/Message');
        const message = new Message({ sender, receiver, content });
        await message.save();
        io.to(receiver).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
