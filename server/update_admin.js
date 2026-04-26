require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function updateAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Remove old admin
  await User.deleteOne({ email: 'admin@dropit.com' });
  
  // Create or update Prashant as Admin
  let user = await User.findOne({ email: 'prashantdubey2306@gmail.com' });
  if (!user) {
    user = new User({ name: 'Prashant', email: 'prashantdubey2306@gmail.com', password: '123456789', role: 'admin' });
    await user.save();
    console.log('Admin account created!');
  } else {
    user.role = 'admin';
    user.password = '123456789'; // In User model, it will hash on save
    await user.save();
    console.log('Admin account updated!');
  }
  
  process.exit(0);
}

updateAdmin().catch(console.error);
