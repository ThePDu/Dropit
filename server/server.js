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
app.use('/api/canteen',  require('./routes/canteen'));
app.use('/api/seller',   require('./routes/sellerAuth'));

app.get('/', (req, res) => res.json({ message: '🛵 DropIt API Running!' }));

io.on('connection', (socket) => {
  // Customer joins a room for their order's live status
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  // Seller joins their store room to receive new order pings
  socket.on('join_store', (storeId) => {
    socket.join(`store_${storeId}`);
  });

  // Seller leaves store room (logout / browser close)
  socket.on('leave_store', (storeId) => {
    socket.leave(`store_${storeId}`);
  });

  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run this to free it:  npx kill-port ${PORT}\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(PORT, () => console.log(`\n🛵 Server running on http://localhost:${PORT} (Socket.IO enabled)\n`));
