require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./db');
const gameHandler = require('./socket/gameHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to your frontend URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/gms', require('./routes/gms'));
app.use('/api/games', require('./routes/games'));
app.use('/api/teams', require('./routes/teams'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('a user connected');
  gameHandler(io, socket, pool);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});