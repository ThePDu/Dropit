const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const path       = require('path');
const http       = require('http');
const { Server } = require('socket.io');
require('./config/db');

dotenv.config();
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH'] }
});

// Make io accessible in routes via req.app.get('io')
app.set('io', io);

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/upload',   require('./routes/upload'));
app.use('/api/coins',    require('./routes/coins'));

app.get('/', (req, res) => res.json({ message: '🛵 DropIt API Running!' }));

io.on('connection', (socket) => {
  // Client joins a room keyed by orderId so only they get updates
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`\n🛵 Server running on http://localhost:${PORT} (Socket.IO enabled)\n`));