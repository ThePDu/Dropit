const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = "mongodb://localhost:27017/dropit";

const icecreams = [
  {
    name: 'Magnum Almond Ice Cream',
    price: 90,
    mrp: 90,
    category: 'frozen',
    description: 'Expertly crafted Magnum Almond Ice Cream stick.',
    stock: 50,
    badge: 'hot',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40110321_3-magnum-ice-cream-almond.jpg',
    images: []
  },
  {
    name: 'Amul Epic Chocobar Ice Cream',
    price: 40,
    mrp: 45,
    category: 'frozen',
    description: 'Rich Belgian chocolate coated vanilla ice cream bar.',
    stock: 120,
    badge: 'bestseller',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40191845_3-amul-epic-chocobar-ice-cream.jpg',
    images: []
  },
  {
    name: "Kwality Wall's Cornetto Double Chocolate",
    price: 60,
    mrp: 60,
    category: 'frozen',
    description: 'Crunchy cone filled with double chocolate ice cream.',
    stock: 80,
    badge: 'new',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40003050_5-kwality-walls-cornetto-double-chocolate-frozen-dessert.jpg',
    images: []
  },
  {
    name: 'Baskin Robbins Praline n Butterscotch',
    price: 105,
    mrp: 120,
    category: 'frozen',
    description: 'Classic butterscotch ice cream with praline pieces.',
    stock: 30,
    badge: '',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40195577_2-baskin-robbins-ice-cream-praline-butterscotch.jpg',
    images: []
  },
  {
    name: 'Havmor Vanilla Block Ice Cream',
    price: 150,
    mrp: 180,
    category: 'frozen',
    description: 'Family pack vanilla ice cream block.',
    stock: 25,
    badge: 'deal',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40019446_4-havmor-ice-cream-vanilla.jpg',
    images: []
  },
  {
    name: 'NIC Natural Alphonso Mango Ice Cream (500ml)',
    price: 300,
    mrp: 350,
    category: 'frozen',
    description: '100% natural ice cream made with real Alphonso mangoes.',
    stock: 15,
    badge: '',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40176313_3-nic-natural-ice-cream-alphonso-mango.jpg',
    images: []
  },
  {
    name: 'Vadilal Kesar Pista Ice Cream Tub',
    price: 260,
    mrp: 290,
    category: 'frozen',
    description: 'Rich and creamy kesar pista ice cream tub.',
    stock: 40,
    badge: '',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40195656_2-vadilal-ice-cream-kesar-pista.jpg',
    images: []
  },
  {
    name: 'Haagen Dazs Belgian Chocolate Mini Cup',
    price: 250,
    mrp: 250,
    category: 'frozen',
    description: 'Premium mini cup of rich Belgian chocolate ice cream.',
    stock: 10,
    badge: 'hot',
    image: 'https://www.bigbasket.com/media/uploads/p/l/100067645_8-haagen-dazs-ice-cream-belgian-chocolate.jpg',
    images: []
  }
];

async function addProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');
    
    // Deduplication check
    await Product.deleteMany({ category: 'frozen', name: { $in: icecreams.map(i => i.name) } });
    
    await Product.insertMany(icecreams);
    console.log('Successfully inserted ice creams!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addProducts();
