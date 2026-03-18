require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const User     = require('./models/User');

const products = [
  // SNACKS (20)
  { name:'Lays Classic Salted',       price:20,  mrp:20,  category:'snacks',     description:'26g · Classic salted chips',         stock:100, badge:'hot',        image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop' },
  { name:'Kurkure Masala Munch',      price:20,  mrp:20,  category:'snacks',     description:'90g · Spicy corn puffs',             stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop' },
  { name:'Lays Magic Masala',         price:20,  mrp:20,  category:'snacks',     description:'26g · Tangy masala chips',           stock:90,  badge:'bestseller', image:'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop' },
  { name:'Bingo Mad Angles',          price:20,  mrp:20,  category:'snacks',     description:'130g · Achari masti flavour',        stock:70,  badge:'',           image:'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop' },
  { name:'Parle-G Biscuits',          price:10,  mrp:10,  category:'snacks',     description:'250g · Classic glucose biscuits',    stock:120, badge:'bestseller', image:'https://images.unsplash.com/photo-1559181567-c3190e86a959?w=400&h=400&fit=crop' },
  { name:'Dark Fantasy Choco Fills',  price:30,  mrp:35,  category:'snacks',     description:'75g · Chocolate filled cookies',     stock:60,  badge:'new',        image:'https://images.unsplash.com/photo-1582499871399-ce4c4bcf24cd?w=400&h=400&fit=crop' },
  { name:'Hide & Seek Bourbon',       price:25,  mrp:25,  category:'snacks',     description:'100g · Chocolate cream biscuits',    stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop' },
  { name:'Monaco Biscuits',           price:15,  mrp:15,  category:'snacks',     description:'200g · Light salted crackers',       stock:90,  badge:'',           image:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop' },
  { name:'Pringles Original',         price:99,  mrp:120, category:'snacks',     description:'107g · Potato crisps',               stock:40,  badge:'new',        image:'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=400&h=400&fit=crop' },
  { name:'Haldiram Aloo Bhujia',      price:30,  mrp:30,  category:'snacks',     description:'200g · Crispy potato bhujia',        stock:70,  badge:'',           image:'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop' },
  { name:'Oreo Chocolate',            price:35,  mrp:40,  category:'snacks',     description:'120g · Chocolate sandwich cookies',  stock:75,  badge:'',           image:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop' },
  { name:'Good Day Butter Biscuits',  price:20,  mrp:20,  category:'snacks',     description:'200g · Rich butter biscuits',        stock:100, badge:'',           image:'https://images.unsplash.com/photo-1617297618684-56a72c7bc15f?w=400&h=400&fit=crop' },
  { name:'Haldiram Mixture',          price:40,  mrp:45,  category:'snacks',     description:'400g · Mixed namkeen',               stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=400&h=400&fit=crop' },
  { name:'Sunfeast Marie Light',      price:25,  mrp:25,  category:'snacks',     description:'250g · Light crispy biscuits',       stock:90,  badge:'',           image:'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop' },
  { name:'Too Yumm Multigrain',       price:20,  mrp:20,  category:'snacks',     description:'55g · Baked multigrain chips',       stock:70,  badge:'new',        image:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop' },
  { name:'Bikaji Khatta Meetha',      price:30,  mrp:30,  category:'snacks',     description:'200g · Sweet & sour mix',            stock:65,  badge:'',           image:'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop' },
  { name:'Cornitos Nachos',           price:30,  mrp:35,  category:'snacks',     description:'60g · Crunchy nacho chips',          stock:50,  badge:'deal',       image:'https://images.unsplash.com/photo-1528750717929-32abb73d3bd9?w=400&h=400&fit=crop' },
  { name:'Cheetos Puffs',             price:20,  mrp:20,  category:'snacks',     description:'43g · Cheese flavoured puffs',       stock:60,  badge:'new',        image:'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop' },
  { name:'Tata Sampann Popcorn',      price:25,  mrp:30,  category:'snacks',     description:'30g · Butter flavour popcorn',       stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1585693185521-fefa0c41ba4c?w=400&h=400&fit=crop' },
  { name:'Bikaji Bikaneri Bhujia',    price:45,  mrp:50,  category:'snacks',     description:'200g · Crispy moong bhujia',         stock:60,  badge:'',           image:'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop' },

  // DRINKS (20)
  { name:'Coca-Cola 250ml',           price:25,  mrp:30,  category:'drinks',     description:'250ml · Classic cola drink',         stock:60,  badge:'deal',       image:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
  { name:'Pepsi 250ml',               price:25,  mrp:30,  category:'drinks',     description:'250ml · Refreshing cola',            stock:55,  badge:'deal',       image:'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop' },
  { name:'Thums Up 500ml',            price:35,  mrp:40,  category:'drinks',     description:'500ml · Strong sparkling cola',      stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop' },
  { name:'Sprite 250ml',              price:25,  mrp:28,  category:'drinks',     description:'250ml · Lemon lime flavour',         stock:60,  badge:'',           image:'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=400&h=400&fit=crop' },
  { name:'Fanta Orange 250ml',        price:25,  mrp:28,  category:'drinks',     description:'250ml · Orange flavoured drink',     stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop' },
  { name:'Mountain Dew 500ml',        price:40,  mrp:45,  category:'drinks',     description:'500ml · Citrus burst soda',          stock:50,  badge:'deal',       image:'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400&h=400&fit=crop' },
  { name:'Frooti Mango 200ml',        price:20,  mrp:20,  category:'drinks',     description:'200ml · Fresh mango drink',          stock:70,  badge:'',           image:'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop' },
  { name:'Maaza Mango 250ml',         price:20,  mrp:20,  category:'drinks',     description:'250ml · Mango fruit drink',          stock:65,  badge:'',           image:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop' },
  { name:'Bisleri Water 1L',          price:20,  mrp:20,  category:'drinks',     description:'1L · Pure mineral water',            stock:150, badge:'',           image:'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop' },
  { name:'Kinley Water 1L',           price:15,  mrp:15,  category:'drinks',     description:'1L · Packaged drinking water',       stock:120, badge:'',           image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop' },
  { name:'Red Bull 250ml',            price:125, mrp:130, category:'drinks',     description:'250ml · Energy drink',               stock:30,  badge:'new',        image:'https://images.unsplash.com/photo-1606168094336-48f205b02b52?w=400&h=400&fit=crop' },
  { name:'Monster Energy 500ml',      price:130, mrp:140, category:'drinks',     description:'500ml · Energy drink',               stock:25,  badge:'new',        image:'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
  { name:'Sting Energy 250ml',        price:30,  mrp:35,  category:'drinks',     description:'250ml · Berry flavour energy',       stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1571167530149-c1105da4c2c5?w=400&h=400&fit=crop' },
  { name:'Real Juice Orange 1L',      price:90,  mrp:99,  category:'drinks',     description:'1L · 100% fruit juice',             stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop' },
  { name:'Tropicana Apple 1L',        price:95,  mrp:105, category:'drinks',     description:'1L · Fresh apple juice',            stock:35,  badge:'',           image:'https://images.unsplash.com/photo-1571167530149-c1105da4c2c5?w=400&h=400&fit=crop' },
  { name:'Paper Boat Aam Panna',      price:30,  mrp:35,  category:'drinks',     description:'200ml · Raw mango drink',            stock:60,  badge:'new',        image:'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop' },
  { name:'Lipton Lemon Iced Tea',     price:30,  mrp:35,  category:'drinks',     description:'300ml · Refreshing iced tea',        stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop' },
  { name:'Complan Chocolate 200g',    price:99,  mrp:115, category:'drinks',     description:'200g · Nutrition drink mix',         stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop' },
  { name:'Horlicks Classic 200g',     price:109, mrp:125, category:'drinks',     description:'200g · Health drink mix',            stock:35,  badge:'',           image:'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400&h=400&fit=crop' },
  { name:'B Natural Mixed Fruit 1L',  price:80,  mrp:90,  category:'drinks',     description:'1L · Mixed fruit juice',            stock:30,  badge:'',           image:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop' },

  // INSTANT FOOD (15)
  { name:'Maggi Masala Noodles',      price:14,  mrp:14,  category:'instant',    description:'70g · Ready in 2 minutes',           stock:100, badge:'hot',        image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop' },
  { name:'Top Ramen Chicken',         price:15,  mrp:15,  category:'instant',    description:'70g · Chicken masala noodles',       stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop' },
  { name:'Yippee Magic Masala',       price:14,  mrp:14,  category:'instant',    description:'70g · Smooth long noodles',          stock:90,  badge:'',           image:'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop' },
  { name:'Knorr Soupy Noodles',       price:25,  mrp:28,  category:'instant',    description:'70g · Chatpata tomato',              stock:60,  badge:'deal',       image:'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop' },
  { name:'Chings Hakka Noodles',      price:30,  mrp:35,  category:'instant',    description:'150g · Classic hakka noodles',       stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop' },
  { name:'Wai Wai Noodles',           price:15,  mrp:15,  category:'instant',    description:'75g · Spicy noodles',                stock:70,  badge:'new',        image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop' },
  { name:'MTR Poha',                  price:40,  mrp:45,  category:'instant',    description:'200g · Ready to cook poha',          stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1630409346824-4f1a9b5def19?w=400&h=400&fit=crop' },
  { name:'MTR Upma',                  price:45,  mrp:50,  category:'instant',    description:'200g · Ready to cook upma',          stock:45,  badge:'',           image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop' },
  { name:'Gits Dal Makhani',          price:75,  mrp:85,  category:'instant',    description:'285g · Ready to eat',                stock:35,  badge:'',           image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop' },
  { name:'Cup Noodles Masala',        price:30,  mrp:35,  category:'instant',    description:'70g · Just add hot water',           stock:65,  badge:'new',        image:'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop' },
  { name:'Maggi Oats Masala',         price:20,  mrp:20,  category:'instant',    description:'38g · Healthy oats noodles',         stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1584255014406-2a68ea38e48c?w=400&h=400&fit=crop' },
  { name:'Sunfeast Pasta Masala',     price:30,  mrp:35,  category:'instant',    description:'65g · Masala pasta',                 stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop' },
  { name:'Haldiram Dal Makhani',      price:70,  mrp:80,  category:'instant',    description:'300g · Ready to eat',                stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop' },
  { name:'Gits Paneer Butter Masala', price:80,  mrp:90,  category:'instant',    description:'285g · Ready to eat',                stock:30,  badge:'',           image:'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop' },
  { name:'ITC Butter Chicken',        price:85,  mrp:95,  category:'instant',    description:'285g · Butter chicken curry',        stock:25,  badge:'new',        image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=400&fit=crop' },

  // DAIRY (10)
  { name:'Amul Butter 100g',          price:55,  mrp:58,  category:'dairy',      description:'100g · Salted table butter',         stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop' },
  { name:'Amul Milk 500ml',           price:30,  mrp:30,  category:'dairy',      description:'500ml · Full cream toned milk',      stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop' },
  { name:'Amul Cheese Slice 10pc',    price:99,  mrp:110, category:'dairy',      description:'200g · Processed cheese slices',     stock:30,  badge:'deal',       image:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop' },
  { name:'Amul Dahi 200g',            price:30,  mrp:32,  category:'dairy',      description:'200g · Fresh curd',                  stock:45,  badge:'',           image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop' },
  { name:'Amul Cream 25ml',           price:20,  mrp:22,  category:'dairy',      description:'25ml · Fresh cream',                 stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop' },
  { name:'Mother Dairy Milk 500ml',   price:28,  mrp:28,  category:'dairy',      description:'500ml · Double toned milk',          stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop' },
  { name:'Epigamia Greek Yogurt',     price:55,  mrp:60,  category:'dairy',      description:'85g · Vanilla flavour yogurt',       stock:25,  badge:'new',        image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop' },
  { name:'Nestle Milkmaid 400g',      price:95,  mrp:105, category:'dairy',      description:'400g · Sweetened condensed milk',    stock:30,  badge:'',           image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop' },
  { name:'Britannia Cheese Spread',   price:80,  mrp:90,  category:'dairy',      description:'180g · Creamy cheese spread',        stock:25,  badge:'',           image:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop' },
  { name:'Amul Lassi 200ml',          price:25,  mrp:25,  category:'dairy',      description:'200ml · Sweet lassi drink',          stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1571167530149-c1105da4c2c5?w=400&h=400&fit=crop' },

  // STATIONERY (10)
  { name:'Reynolds Blue Pen',         price:10,  mrp:10,  category:'stationery', description:'Pack of 1 · Smooth ballpoint',       stock:150, badge:'',           image:'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop' },
  { name:'Classmate Notebook 200pg',  price:45,  mrp:50,  category:'stationery', description:'200 pages · Ruled A4 notebook',     stock:60,  badge:'new',        image:'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop' },
  { name:'Fevicol MR 50g',            price:30,  mrp:30,  category:'stationery', description:'50g · Strong adhesive',              stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop' },
  { name:'Apsara Pencil HB 10pc',     price:30,  mrp:35,  category:'stationery', description:'Pack of 10 · HB pencils',            stock:100, badge:'',           image:'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop' },
  { name:'Natraj Eraser Pack 2',      price:5,   mrp:5,   category:'stationery', description:'Pack of 2 · White erasers',          stock:200, badge:'',           image:'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop' },
  { name:'Cello Tape 1 inch',         price:20,  mrp:20,  category:'stationery', description:'1 inch · Clear adhesive tape',       stock:90,  badge:'',           image:'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop' },
  { name:'Stapler with 1000 Pins',    price:60,  mrp:75,  category:'stationery', description:'Mini stapler with staple pins',      stock:40,  badge:'deal',       image:'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop' },
  { name:'Highlighter Set 4 Colors',  price:80,  mrp:95,  category:'stationery', description:'Pack of 4 · Pastel highlighters',    stock:50,  badge:'new',        image:'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop' },
  { name:'Flair Ball Pen 5pc',        price:40,  mrp:45,  category:'stationery', description:'Pack of 5 · Multicolor pens',        stock:70,  badge:'',           image:'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop' },
  { name:'A4 Paper 100 Sheets',       price:55,  mrp:60,  category:'stationery', description:'100 sheets · White A4 paper',        stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop' },

  // MEDICINES (10)
  { name:'Glucose-D Orange 100g',     price:55,  mrp:60,  category:'medicines',  description:'100g · Energy glucose powder',       stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' },
  { name:'Vicks VapoRub 10ml',        price:60,  mrp:65,  category:'medicines',  description:'10ml · Cold & cough relief',         stock:35,  badge:'',           image:'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop' },
  { name:'Band-Aid Flexible 10pc',    price:35,  mrp:40,  category:'medicines',  description:'10 strips · Flexible fabric strips', stock:60,  badge:'',           image:'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop' },
  { name:'Dettol Antiseptic 50ml',    price:55,  mrp:60,  category:'medicines',  description:'50ml · Antiseptic liquid',           stock:45,  badge:'',           image:'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop' },
  { name:'Hajmola Candy 60pc',        price:25,  mrp:25,  category:'medicines',  description:'60 pieces · Digestive candy',        stock:80,  badge:'hot',        image:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=400&fit=crop' },
  { name:'Eno Fruit Salt Regular',    price:30,  mrp:32,  category:'medicines',  description:'30g · Lemon flavour antacid',        stock:55,  badge:'',           image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop' },
  { name:'ORS Electral Powder',       price:30,  mrp:35,  category:'medicines',  description:'21.8g · Oral rehydration salts',     stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop' },
  { name:'Iodex Pain Relief 8g',      price:45,  mrp:50,  category:'medicines',  description:'8g · Fast pain relief balm',         stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop' },
  { name:'Digene Gel Orange 200ml',   price:95,  mrp:105, category:'medicines',  description:'200ml · Antacid gel',                stock:30,  badge:'',           image:'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop' },
  { name:'Pudinhara Liquid 30ml',     price:35,  mrp:38,  category:'medicines',  description:'30ml · Peppermint digestive',        stock:45,  badge:'',           image:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=400&fit=crop' },

  // HYGIENE (15)
  { name:'Dettol Soap 75g',           price:45,  mrp:50,  category:'hygiene',    description:'75g · Antiseptic protection',        stock:60,  badge:'deal',       image:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop' },
  { name:'Colgate MaxFresh 150g',     price:99,  mrp:110, category:'hygiene',    description:'150g · Cool mint toothpaste',        stock:55,  badge:'deal',       image:'https://images.unsplash.com/photo-1559591937-4d54bf8dc74c?w=400&h=400&fit=crop' },
  { name:'Dove Soap 100g',            price:55,  mrp:60,  category:'hygiene',    description:'100g · Moisturising beauty bar',     stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1547454613-71c07df4fb9c?w=400&h=400&fit=crop' },
  { name:'Lifebuoy Soap 125g',        price:35,  mrp:38,  category:'hygiene',    description:'125g · Total germ protection',       stock:70,  badge:'',           image:'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=400&fit=crop' },
  { name:'Head & Shoulders 72ml',     price:99,  mrp:110, category:'hygiene',    description:'72ml · Anti-dandruff shampoo',       stock:35,  badge:'',           image:'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop' },
  { name:'Pantene Shampoo 80ml',      price:85,  mrp:95,  category:'hygiene',    description:'80ml · Smooth & silky shampoo',      stock:40,  badge:'new',        image:'https://images.unsplash.com/photo-1626203248734-f79e4c851cc0?w=400&h=400&fit=crop' },
  { name:'Nivea Men Face Wash 50ml',  price:85,  mrp:99,  category:'hygiene',    description:'50ml · Oil control face wash',       stock:30,  badge:'',           image:'https://images.unsplash.com/photo-1601612628452-9e99ced43524?w=400&h=400&fit=crop' },
  { name:'Listerine Mouthwash 80ml',  price:65,  mrp:75,  category:'hygiene',    description:'80ml · Cool mint mouthwash',         stock:40,  badge:'',           image:'https://images.unsplash.com/photo-1559591937-4d54bf8dc74c?w=400&h=400&fit=crop' },
  { name:'Gillette Mach3 Razor',      price:199, mrp:225, category:'hygiene',    description:'1 razor · 3 blade precision',        stock:25,  badge:'',           image:'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop' },
  { name:'Pepsodent Toothbrush',      price:30,  mrp:35,  category:'hygiene',    description:'1 brush · Soft bristles',            stock:80,  badge:'',           image:'https://images.unsplash.com/photo-1559591937-4d54bf8dc74c?w=400&h=400&fit=crop' },
  { name:'Parachute Coconut Oil 50ml',price:35,  mrp:38,  category:'hygiene',    description:'50ml · 100% pure coconut oil',       stock:65,  badge:'',           image:'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop' },
  { name:'Fogg Deodorant 120ml',      price:179, mrp:199, category:'hygiene',    description:'120ml · No gas deo',                 stock:30,  badge:'new',        image:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop' },
  { name:'Rexona Deo 150ml',          price:165, mrp:185, category:'hygiene',    description:'150ml · 48hr protection deo',        stock:35,  badge:'',           image:'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&h=400&fit=crop' },
  { name:'Sensodyne Toothpaste 70g',  price:115, mrp:130, category:'hygiene',    description:'70g · Sensitive teeth protection',   stock:30,  badge:'',           image:'https://images.unsplash.com/photo-1626203248734-f79e4c851cc0?w=400&h=400&fit=crop' },
  { name:'Whisper Ultra 6pc',         price:55,  mrp:60,  category:'hygiene',    description:'6 pads · Ultra thin pads',           stock:50,  badge:'',           image:'https://images.unsplash.com/photo-1547454613-71c07df4fb9c?w=400&h=400&fit=crop' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('\n🌱 Seeding database with 100 products...\n');
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} products added with real images!`);
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