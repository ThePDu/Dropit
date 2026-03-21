require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const User     = require('./models/User');
const https    = require('https');
const http     = require('http');
const fs       = require('fs');
const path     = require('path');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Properly follow redirects up to 10 times
function downloadImage(url, filename, redirectCount = 0) {
  return new Promise((resolve) => {
    if (redirectCount > 10) { resolve(''); return; }

    const filePath = path.join(uploadDir, filename);
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const redirectUrl = res.headers.location;
        if (!redirectUrl) { resolve(''); return; }
        const fullUrl = redirectUrl.startsWith('http') ? redirectUrl : `https://unsplash.com${redirectUrl}`;
        downloadImage(fullUrl, filename, redirectCount + 1).then(resolve);
        return;
      }

      if (res.statusCode !== 200) { resolve(''); return; }

      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        // Check file is real image (> 5KB)
        const stats = fs.statSync(filePath);
        if (stats.size < 5000) {
          fs.unlinkSync(filePath);
          resolve('');
        } else {
          resolve(`/uploads/${filename}`);
        }
      });
    });

    req.on('error', () => { resolve(''); });
    req.setTimeout(15000, () => { req.destroy(); resolve(''); });
  });
}

const productData = [
  // ── SNACKS ──
  { name:'Lays Classic Salted',       price:20,  mrp:20,  category:'snacks',     description:'26g · Classic salted chips',         stock:100, badge:'hot',        img:'lays.jpg',          url:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop' },
  { name:'Kurkure Masala Munch',      price:20,  mrp:20,  category:'snacks',     description:'90g · Spicy corn puffs',             stock:80,  badge:'',           img:'kurkure.jpg',       url:'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop' },
  { name:'Lays Magic Masala',         price:20,  mrp:20,  category:'snacks',     description:'26g · Tangy masala chips',           stock:90,  badge:'bestseller', img:'laysmasala.jpg',    url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop' },
  { name:'Bingo Mad Angles',          price:20,  mrp:20,  category:'snacks',     description:'130g · Achari masti flavour',        stock:70,  badge:'',           img:'bingo.jpg',         url:'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop' },
  { name:'Parle-G Biscuits',          price:10,  mrp:10,  category:'snacks',     description:'250g · Classic glucose biscuits',    stock:120, badge:'bestseller', img:'parleg.jpg',        url:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop' },
  { name:'Dark Fantasy Choco Fills',  price:30,  mrp:35,  category:'snacks',     description:'75g · Chocolate filled cookies',     stock:60,  badge:'new',        img:'darkfantasy.jpg',   url:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop' },
  { name:'Oreo Chocolate',            price:35,  mrp:40,  category:'snacks',     description:'120g · Chocolate sandwich cookies',  stock:75,  badge:'',           img:'oreo.jpg',          url:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop' },
  { name:'Pringles Original',         price:99,  mrp:120, category:'snacks',     description:'107g · Potato crisps',               stock:40,  badge:'new',        img:'pringles.jpg',      url:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop' },
  { name:'Haldiram Aloo Bhujia',      price:30,  mrp:30,  category:'snacks',     description:'200g · Crispy potato bhujia',        stock:70,  badge:'',           img:'bhujia.jpg',        url:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop' },
  { name:'Cornitos Nachos',           price:30,  mrp:35,  category:'snacks',     description:'60g · Crunchy nacho chips',          stock:50,  badge:'deal',       img:'nachos.jpg',        url:'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=300&fit=crop' },
  { name:'Tata Sampann Popcorn',      price:25,  mrp:30,  category:'snacks',     description:'30g · Butter flavour popcorn',       stock:80,  badge:'',           img:'popcorn.jpg',       url:'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=300&h=300&fit=crop' },
  { name:'Haldiram Mixture',          price:40,  mrp:45,  category:'snacks',     description:'400g · Mixed namkeen',               stock:55,  badge:'',           img:'mixture.jpg',       url:'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop' },

  // ── DRINKS ──
  { name:'Coca-Cola 250ml',           price:25,  mrp:30,  category:'drinks',     description:'250ml · Classic cola drink',         stock:60,  badge:'deal',       img:'cocacola.jpg',      url:'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop' },
  { name:'Pepsi 250ml',               price:25,  mrp:30,  category:'drinks',     description:'250ml · Refreshing cola',            stock:55,  badge:'deal',       img:'pepsi.jpg',         url:'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=300&h=300&fit=crop' },
  { name:'Thums Up 500ml',            price:35,  mrp:40,  category:'drinks',     description:'500ml · Strong sparkling cola',      stock:50,  badge:'',           img:'thumsup.jpg',       url:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=300&fit=crop' },
  { name:'Sprite 250ml',              price:25,  mrp:28,  category:'drinks',     description:'250ml · Lemon lime flavour',         stock:60,  badge:'',           img:'sprite.jpg',        url:'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=300&h=300&fit=crop' },
  { name:'Fanta Orange 250ml',        price:25,  mrp:28,  category:'drinks',     description:'250ml · Orange flavoured drink',     stock:55,  badge:'',           img:'fanta.jpg',         url:'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=300&h=300&fit=crop' },
  { name:'Mountain Dew 500ml',        price:40,  mrp:45,  category:'drinks',     description:'500ml · Citrus burst soda',          stock:50,  badge:'deal',       img:'mountaindew.jpg',   url:'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=300&h=300&fit=crop' },
  { name:'Frooti Mango 200ml',        price:20,  mrp:20,  category:'drinks',     description:'200ml · Fresh mango drink',          stock:70,  badge:'',           img:'frooti.jpg',        url:'https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop' },
  { name:'Maaza Mango 250ml',         price:31,  mrp:35,  category:'drinks',     description:'250ml · Mango fruit drink',          stock:65,  badge:'',           img:'maaza.jpg',         url:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop' },
  { name:'Bisleri Water 1L',          price:20,  mrp:20,  category:'drinks',     description:'1L · Pure mineral water',            stock:150, badge:'',           img:'bisleri.jpg',       url:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300&h=300&fit=crop' },
  { name:'Red Bull 250ml',            price:125, mrp:130, category:'drinks',     description:'250ml · Energy drink',               stock:30,  badge:'new',        img:'redbull.jpg',       url:'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&h=300&fit=crop' },
  { name:'Real Juice Orange 1L',      price:90,  mrp:99,  category:'drinks',     description:'1L · 100% fruit juice',              stock:40,  badge:'',           img:'realjuice.jpg',     url:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop' },
  { name:'Tropicana Apple 1L',        price:95,  mrp:105, category:'drinks',     description:'1L · Fresh apple juice',             stock:35,  badge:'',           img:'tropicana.jpg',     url:'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=300&h=300&fit=crop' },
  { name:'Lipton Lemon Iced Tea',     price:30,  mrp:35,  category:'drinks',     description:'300ml · Refreshing iced tea',        stock:55,  badge:'',           img:'ictea.jpg',         url:'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=300&h=300&fit=crop' },

  // ── INSTANT FOOD ──
  { name:'Maggi Masala Noodles',      price:14,  mrp:14,  category:'instant',    description:'70g · Ready in 2 minutes',           stock:100, badge:'hot',        img:'maggi.jpg',         url:'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop' },
  { name:'Top Ramen Chicken',         price:15,  mrp:15,  category:'instant',    description:'70g · Chicken masala noodles',       stock:80,  badge:'',           img:'topramen.jpg',      url:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop' },
  { name:'Yippee Magic Masala',       price:14,  mrp:14,  category:'instant',    description:'70g · Smooth long noodles',          stock:90,  badge:'',           img:'yippee.jpg',        url:'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=300&fit=crop' },
  { name:'Knorr Soupy Noodles',       price:25,  mrp:28,  category:'instant',    description:'70g · Chatpata tomato',              stock:60,  badge:'deal',       img:'knorr.jpg',         url:'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop' },
  { name:'MTR Poha',                  price:40,  mrp:45,  category:'instant',    description:'200g · Ready to cook poha',          stock:50,  badge:'',           img:'poha.jpg',          url:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=300&fit=crop' },
  { name:'MTR Upma',                  price:45,  mrp:50,  category:'instant',    description:'200g · Ready to cook upma',          stock:45,  badge:'',           img:'upma.jpg',          url:'https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=300&fit=crop' },
  { name:'Gits Dal Makhani',          price:75,  mrp:85,  category:'instant',    description:'285g · Ready to eat',                stock:35,  badge:'',           img:'dalmakhani.jpg',    url:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop' },
  { name:'Cup Noodles Masala',        price:30,  mrp:35,  category:'instant',    description:'70g · Just add hot water',           stock:65,  badge:'new',        img:'cupnoodles.jpg',    url:'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop' },
  { name:'Gits Paneer Butter Masala', price:80,  mrp:90,  category:'instant',    description:'285g · Ready to eat',                stock:30,  badge:'',           img:'paneer.jpg',        url:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=300&fit=crop' },
  { name:'ITC Butter Chicken',        price:85,  mrp:95,  category:'instant',    description:'285g · Butter chicken curry',        stock:25,  badge:'new',        img:'butterchicken.jpg', url:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop' },

  // ── DAIRY ──
  { name:'Amul Butter 100g',          price:55,  mrp:58,  category:'dairy',      description:'100g · Salted table butter',         stock:40,  badge:'',           img:'butter.jpg',        url:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop' },
  { name:'Amul Milk 500ml',           price:30,  mrp:30,  category:'dairy',      description:'500ml · Full cream toned milk',      stock:50,  badge:'',           img:'milk.jpg',          url:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop' },
  { name:'Amul Cheese Slice 10pc',    price:99,  mrp:110, category:'dairy',      description:'200g · Processed cheese slices',     stock:30,  badge:'deal',       img:'cheese.jpg',        url:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop' },
  { name:'Amul Dahi 200g',            price:30,  mrp:32,  category:'dairy',      description:'200g · Fresh curd',                  stock:45,  badge:'',           img:'dahi.jpg',          url:'https://images.unsplash.com/photo-1571212515416-fca988083c20?w=300&h=300&fit=crop' },
  { name:'Epigamia Greek Yogurt',     price:55,  mrp:60,  category:'dairy',      description:'85g · Vanilla flavour yogurt',       stock:25,  badge:'new',        img:'greekyogurt.jpg',   url:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop' },
  { name:'Nestle Milkmaid 400g',      price:95,  mrp:105, category:'dairy',      description:'400g · Sweetened condensed milk',    stock:30,  badge:'',           img:'milkmaid.jpg',      url:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop' },
  { name:'Amul Lassi 200ml',          price:25,  mrp:25,  category:'dairy',      description:'200ml · Sweet lassi drink',          stock:50,  badge:'',           img:'lassi.jpg',         url:'https://images.unsplash.com/photo-1571212515416-fca988083c20?w=300&h=300&fit=crop' },

  // ── STATIONERY ──
  { name:'Reynolds Blue Pen',         price:10,  mrp:10,  category:'stationery', description:'Pack of 1 · Smooth ballpoint',       stock:150, badge:'',           img:'pen.jpg',           url:'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=300&h=300&fit=crop' },
  { name:'Classmate Notebook 200pg',  price:45,  mrp:50,  category:'stationery', description:'200 pages · Ruled A4 notebook',      stock:60,  badge:'new',        img:'notebook.jpg',      url:'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&h=300&fit=crop' },
  { name:'Apsara Pencil HB 10pc',     price:30,  mrp:35,  category:'stationery', description:'Pack of 10 · HB pencils',            stock:100, badge:'',           img:'pencil.jpg',        url:'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&h=300&fit=crop' },
  { name:'Highlighter Set 4 Colors',  price:80,  mrp:95,  category:'stationery', description:'Pack of 4 · Pastel highlighters',    stock:50,  badge:'new',        img:'highlighter.jpg',   url:'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop' },
  { name:'Flair Ball Pen 5pc',        price:40,  mrp:45,  category:'stationery', description:'Pack of 5 · Multicolor pens',        stock:70,  badge:'',           img:'flairpen.jpg',      url:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop' },

  // ── MEDICINES ──
  { name:'Vicks VapoRub 10ml',        price:60,  mrp:65,  category:'medicines',  description:'10ml · Cold & cough relief',         stock:35,  badge:'',           img:'vicks.jpg',         url:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { name:'Band-Aid Flexible 10pc',    price:35,  mrp:40,  category:'medicines',  description:'10 strips · Flexible fabric strips', stock:60,  badge:'',           img:'bandaid.jpg',       url:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop' },
  { name:'Dettol Antiseptic 50ml',    price:55,  mrp:60,  category:'medicines',  description:'50ml · Antiseptic liquid',           stock:45,  badge:'',           img:'dettolanti.jpg',    url:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { name:'Hajmola Candy 60pc',        price:25,  mrp:25,  category:'medicines',  description:'60 pieces · Digestive candy',        stock:80,  badge:'hot',        img:'hajmola.jpg',       url:'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300&h=300&fit=crop' },
  { name:'Eno Fruit Salt Regular',    price:30,  mrp:32,  category:'medicines',  description:'30g · Lemon flavour antacid',        stock:55,  badge:'',           img:'eno.jpg',           url:'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=300&fit=crop' },
  { name:'ORS Electral Powder',       price:30,  mrp:35,  category:'medicines',  description:'21.8g · Oral rehydration salts',     stock:50,  badge:'',           img:'ors.jpg',           url:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { name:'Iodex Pain Relief 8g',      price:45,  mrp:50,  category:'medicines',  description:'8g · Fast pain relief balm',         stock:40,  badge:'',           img:'iodex.jpg',         url:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop' },

  // ── HYGIENE ──
  { name:'Dettol Soap 75g',           price:45,  mrp:50,  category:'hygiene',    description:'75g · Antiseptic protection',        stock:60,  badge:'deal',       img:'dettolsoap.jpg',    url:'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&h=300&fit=crop' },
  { name:'Colgate MaxFresh 150g',     price:99,  mrp:110, category:'hygiene',    description:'150g · Cool mint toothpaste',        stock:55,  badge:'deal',       img:'colgate.jpg',       url:'https://images.unsplash.com/photo-1559304822-9eb2813c9844?w=300&h=300&fit=crop' },
  { name:'Dove Soap 100g',            price:55,  mrp:60,  category:'hygiene',    description:'100g · Moisturising beauty bar',     stock:50,  badge:'',           img:'dove.jpg',          url:'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=300&h=300&fit=crop' },
  { name:'Lifebuoy Soap 125g',        price:35,  mrp:38,  category:'hygiene',    description:'125g · Total germ protection',       stock:70,  badge:'',           img:'lifebuoy.jpg',      url:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&h=300&fit=crop' },
  { name:'Head & Shoulders 72ml',     price:99,  mrp:110, category:'hygiene',    description:'72ml · Anti-dandruff shampoo',       stock:35,  badge:'',           img:'headshoulders.jpg', url:'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&h=300&fit=crop' },
  { name:'Pantene Shampoo 80ml',      price:85,  mrp:95,  category:'hygiene',    description:'80ml · Smooth & silky shampoo',      stock:40,  badge:'new',        img:'pantene.jpg',       url:'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop' },
  { name:'Nivea Men Face Wash 50ml',  price:85,  mrp:99,  category:'hygiene',    description:'50ml · Oil control face wash',       stock:30,  badge:'',           img:'facewash.jpg',      url:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop' },
  { name:'Gillette Mach3 Razor',      price:199, mrp:225, category:'hygiene',    description:'1 razor · 3 blade precision',        stock:25,  badge:'',           img:'razor.jpg',         url:'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=300&h=300&fit=crop' },
  { name:'Pepsodent Toothbrush',      price:30,  mrp:35,  category:'hygiene',    description:'1 brush · Soft bristles',            stock:80,  badge:'',           img:'toothbrush.jpg',    url:'https://images.unsplash.com/photo-1559304822-9eb2813c9844?w=300&h=300&fit=crop' },
  { name:'Fogg Deodorant 120ml',      price:179, mrp:199, category:'hygiene',    description:'120ml · No gas deo',                 stock:30,  badge:'new',        img:'fogg.jpg',          url:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop' },
  { name:'Sensodyne Toothpaste 70g',  price:115, mrp:130, category:'hygiene',    description:'70g · Sensitive teeth protection',   stock:30,  badge:'',           img:'sensodyne.jpg',     url:'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&h=300&fit=crop' },
  { name:'Whisper Ultra 6pc',         price:55,  mrp:60,  category:'hygiene',    description:'6 pads · Ultra thin pads',           stock:50,  badge:'',           img:'whisper.jpg',       url:'https://images.unsplash.com/photo-1584515933487-779824d29309?w=300&h=300&fit=crop' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('\n🗑️  Deleting old bad images...');

  // Delete all old 567-byte broken files
  const files = fs.readdirSync(uploadDir);
  let deleted = 0;
  for (const f of files) {
    const fp = path.join(uploadDir, f);
    const size = fs.statSync(fp).size;
    if (size < 5000 && f !== '.gitkeep') { fs.unlinkSync(fp); deleted++; }
  }
  console.log(`✅ Deleted ${deleted} broken files\n`);
  console.log('📥 Downloading real images...\n');

  const products = [];
  for (const p of productData) {
    process.stdout.write(`⬇️  ${p.name}... `);
    const localPath = await downloadImage(p.url, p.img);
    const imageUrl  = localPath ? `http://localhost:5000${localPath}` : '';
    console.log(localPath ? '✅' : '❌ failed');
    products.push({
      name: p.name, price: p.price, mrp: p.mrp,
      category: p.category, description: p.description,
      stock: p.stock, badge: p.badge, image: imageUrl
    });
  }

  console.log('\n🌱 Saving to MongoDB...');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} products added!`);

  const exists = await User.findOne({ email: 'admin@dropit.com' });
  if (!exists) {
    await User.create({ name:'Admin', email:'admin@dropit.com', password:'admin123', role:'admin' });
    console.log('✅ Admin: admin@dropit.com / admin123');
  } else {
    console.log('ℹ️  Admin already exists');
  }
  console.log('\n🎉 Done! Run: npm run dev\n');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });