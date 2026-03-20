const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
require('./config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/upload',   require('./routes/upload'));

app.get('/', (req, res) => res.json({ message: '🛵 DropIt API Running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n🛵 Server running on http://localhost:${PORT}\n`));