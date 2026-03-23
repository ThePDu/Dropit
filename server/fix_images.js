const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = "mongodb://localhost:27017/dropit";

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB...');
    
    // High-quality aesthetic Unsplash URLs that never block hotlinking
    const unsplashImages = [
      'https://images.unsplash.com/photo-1558500473-8255018659ae?auto=format&fit=crop&w=400&q=80', // Stick ice cream
      'https://images.unsplash.com/photo-1570197781417-0c7f3e821811?auto=format&fit=crop&w=400&q=80', // Tub/bowl
      'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&w=400&q=80', // Cone
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80', // Mango
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80', // Vanilla
      'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=400&q=80', // Mixed
      'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=400&q=80', // Kesar/Pista style
      'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=400&q=80'  // Chocolate style
    ];

    const products = await Product.find({ category: 'frozen' });
    
    for (let i = 0; i < products.length; i++) {
      products[i].image = unsplashImages[i % unsplashImages.length];
      await products[i].save();
    }
    
    console.log('Fixed ice cream images!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixImages();
