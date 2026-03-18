require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const User     = require('./models/User');

const products = [

  // ── SNACKS (20 products) ──
  { name:'Lays Classic Salted',       price:20,  mrp:20,  category:'snacks',     description:'26g · Classic salted chips',         stock:100, badge:'hot',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40102144_4-lays-potato-chips-classic-salted.jpg' },
  { name:'Kurkure Masala Munch',      price:20,  mrp:20,  category:'snacks',     description:'90g · Spicy corn puffs',             stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059545_5-kurkure-masala-munch.jpg' },
  { name:'Lays Magic Masala',         price:20,  mrp:20,  category:'snacks',     description:'26g · Tangy masala chips',           stock:90,  badge:'bestseller', image:'https://www.bigbasket.com/media/uploads/p/xxl/40102146_5-lays-potato-chips-magic-masala.jpg' },
  { name:'Bingo Mad Angles',          price:20,  mrp:20,  category:'snacks',     description:'130g · Achari masti flavour',        stock:70,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40170677_3-bingo-mad-angles-achaari-masti.jpg' },
  { name:'Parle-G Biscuits',          price:10,  mrp:10,  category:'snacks',     description:'250g · Classic glucose biscuits',    stock:120, badge:'bestseller', image:'https://www.bigbasket.com/media/uploads/p/xxl/30001284_6-parle-g-biscuits.jpg' },
  { name:'Dark Fantasy Choco Fills',  price:30,  mrp:35,  category:'snacks',     description:'75g · Chocolate filled cookies',     stock:60,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40155150_3-sunfeast-dark-fantasy-choco-fills.jpg' },
  { name:'Hide & Seek Bourbon',       price:25,  mrp:25,  category:'snacks',     description:'100g · Chocolate cream biscuits',    stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40060006_4-parle-hide-seek-bourbon.jpg' },
  { name:'Monaco Biscuits',           price:15,  mrp:15,  category:'snacks',     description:'200g · Light salted crackers',       stock:90,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40060008_4-parle-monaco-biscuits.jpg' },
  { name:'Pringles Original',         price:99,  mrp:120, category:'snacks',     description:'107g · Potato crisps',               stock:40,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40082888_3-pringles-original.jpg' },
  { name:'Haldiram Aloo Bhujia',      price:30,  mrp:30,  category:'snacks',     description:'200g · Crispy potato bhujia',        stock:70,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059548_4-haldirams-aloo-bhujia.jpg' },
  { name:'Oreo Chocolate',            price:35,  mrp:40,  category:'snacks',     description:'120g · Chocolate sandwich cookies',  stock:75,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059538_3-oreo-chocolate-sandwich-cookies.jpg' },
  { name:'Good Day Butter Biscuits',  price:20,  mrp:20,  category:'snacks',     description:'200g · Rich butter biscuits',        stock:100, badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/30001278_6-britannia-good-day-butter-cookies.jpg' },
  { name:'Haldiram Mixture',          price:40,  mrp:45,  category:'snacks',     description:'400g · Mixed namkeen',               stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059546_3-haldirams-mixture.jpg' },
  { name:'Sunfeast Marie Light',      price:25,  mrp:25,  category:'snacks',     description:'250g · Light crispy biscuits',       stock:90,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40060003_3-sunfeast-marie-light-biscuits.jpg' },
  { name:'Too Yumm Multigrain',       price:20,  mrp:20,  category:'snacks',     description:'55g · Baked multigrain chips',       stock:70,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40155149_3-too-yumm-multigrain-thins.jpg' },
  { name:'Bikaji Khatta Meetha',      price:30,  mrp:30,  category:'snacks',     description:'200g · Sweet & sour mix',            stock:65,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059547_3-bikaji-khatta-meetha.jpg' },
  { name:'Cornitos Nachos',           price:30,  mrp:35,  category:'snacks',     description:'60g · Crunchy nacho chips',          stock:50,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059537_3-cornitos-nachos-crisps-italian-pizza.jpg' },
  { name:'Cheetos Puffs',             price:20,  mrp:20,  category:'snacks',     description:'43g · Cheese flavoured puffs',       stock:60,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40102148_3-cheetos-cheese-puffs.jpg' },
  { name:'Tata Sampann Popcorn',      price:25,  mrp:30,  category:'snacks',     description:'30g · Butter flavour popcorn',       stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40155152_3-tata-sampann-popcorn-butter-regular.jpg' },
  { name:'Bikaji Bikaneri Bhujia',    price:45,  mrp:50,  category:'snacks',     description:'200g · Crispy moong bhujia',         stock:60,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059549_3-bikaji-bikaneri-bhujia.jpg' },

  // ── DRINKS (20 products) ──
  { name:'Coca-Cola 250ml',           price:25,  mrp:30,  category:'drinks',     description:'250ml · Classic cola drink',         stock:60,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059560_4-coca-cola-soft-drink.jpg' },
  { name:'Pepsi 250ml',               price:25,  mrp:30,  category:'drinks',     description:'250ml · Refreshing cola',            stock:55,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059561_3-pepsi-soft-drink.jpg' },
  { name:'Thums Up 500ml',            price:35,  mrp:40,  category:'drinks',     description:'500ml · Strong sparkling cola',      stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059562_3-thums-up-soft-drink.jpg' },
  { name:'Sprite 250ml',              price:25,  mrp:28,  category:'drinks',     description:'250ml · Lemon lime flavour',         stock:60,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059563_3-sprite-soft-drink.jpg' },
  { name:'Fanta Orange 250ml',        price:25,  mrp:28,  category:'drinks',     description:'250ml · Orange flavoured drink',     stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059564_3-fanta-orange-soft-drink.jpg' },
  { name:'Mountain Dew 500ml',        price:40,  mrp:45,  category:'drinks',     description:'500ml · Citrus burst soda',          stock:50,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059565_3-mountain-dew-soft-drink.jpg' },
  { name:'Frooti Mango 200ml',        price:20,  mrp:20,  category:'drinks',     description:'200ml · Fresh mango drink',          stock:70,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059566_3-frooti-mango-fruit-drink.jpg' },
  { name:'Maaza Mango 250ml',         price:20,  mrp:20,  category:'drinks',     description:'250ml · Mango fruit drink',          stock:65,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059567_3-maaza-mango-fruit-drink.jpg' },
  { name:'Bisleri Water 1L',          price:20,  mrp:20,  category:'drinks',     description:'1L · Pure mineral water',            stock:150, badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059568_3-bisleri-water.jpg' },
  { name:'Kinley Water 1L',           price:15,  mrp:15,  category:'drinks',     description:'1L · Packaged drinking water',       stock:120, badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059569_3-kinley-water.jpg' },
  { name:'Red Bull 250ml',            price:125, mrp:130, category:'drinks',     description:'250ml · Energy drink',               stock:30,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40082889_3-red-bull-energy-drink.jpg' },
  { name:'Monster Energy 500ml',      price:130, mrp:140, category:'drinks',     description:'500ml · Energy drink',               stock:25,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40082890_3-monster-energy-drink.jpg' },
  { name:'Sting Energy 250ml',        price:30,  mrp:35,  category:'drinks',     description:'250ml · Berry flavour energy',       stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40102150_3-sting-energy-drink.jpg' },
  { name:'Real Juice Orange 1L',      price:90,  mrp:99,  category:'drinks',     description:'1L · 100% fruit juice',             stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059570_3-real-fruit-juice-orange.jpg' },
  { name:'Tropicana Apple 1L',        price:95,  mrp:105, category:'drinks',     description:'1L · Fresh apple juice',            stock:35,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059571_3-tropicana-apple-juice.jpg' },
  { name:'Paper Boat Aam Panna',      price:30,  mrp:35,  category:'drinks',     description:'200ml · Raw mango drink',            stock:60,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40102151_3-paper-boat-aam-panna.jpg' },
  { name:'Lipton Lemon Iced Tea',     price:30,  mrp:35,  category:'drinks',     description:'300ml · Refreshing iced tea',        stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40102152_3-lipton-iced-tea-lemon.jpg' },
  { name:'Complan Chocolate 200g',    price:99,  mrp:115, category:'drinks',     description:'200g · Nutrition drink mix',         stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059572_3-complan-chocolate.jpg' },
  { name:'Horlicks Classic 200g',     price:109, mrp:125, category:'drinks',     description:'200g · Health drink mix',            stock:35,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059573_3-horlicks-classic-malt.jpg' },
  { name:'B Natural Mixed Fruit 1L',  price:80,  mrp:90,  category:'drinks',     description:'1L · Mixed fruit juice',            stock:30,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40102153_3-b-natural-mixed-fruit.jpg' },

  // ── INSTANT FOOD (15 products) ──
  { name:'Maggi Masala Noodles',      price:14,  mrp:14,  category:'instant',    description:'70g · Ready in 2 minutes',           stock:100, badge:'hot',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059580_5-maggi-2-minute-noodles-masala.jpg' },
  { name:'Top Ramen Chicken',         price:15,  mrp:15,  category:'instant',    description:'70g · Chicken masala noodles',       stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059581_4-top-ramen-noodles-chicken.jpg' },
  { name:'Yippee Magic Masala',       price:14,  mrp:14,  category:'instant',    description:'70g · Smooth long noodles',          stock:90,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059582_4-yippee-magic-masala-noodles.jpg' },
  { name:'Knorr Soupy Noodles',       price:25,  mrp:28,  category:'instant',    description:'70g · Chatpata tomato',              stock:60,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059583_3-knorr-soupy-noodles-tomato.jpg' },
  { name:'Chings Hakka Noodles',      price:30,  mrp:35,  category:'instant',    description:'150g · Classic hakka noodles',       stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059584_3-chings-secret-hakka-noodles.jpg' },
  { name:'Wai Wai Noodles',           price:15,  mrp:15,  category:'instant',    description:'75g · Spicy noodles',                stock:70,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059585_3-wai-wai-noodles.jpg' },
  { name:'MTR Poha',                  price:40,  mrp:45,  category:'instant',    description:'200g · Ready to cook poha',          stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059586_3-mtr-poha.jpg' },
  { name:'MTR Upma',                  price:45,  mrp:50,  category:'instant',    description:'200g · Ready to cook upma',          stock:45,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059587_3-mtr-upma.jpg' },
  { name:'Gits Dal Makhani',          price:75,  mrp:85,  category:'instant',    description:'285g · Ready to eat',                stock:35,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059588_3-gits-dal-makhani.jpg' },
  { name:'Cup Noodles Masala',        price:30,  mrp:35,  category:'instant',    description:'70g · Just add hot water',           stock:65,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059589_3-nissin-cup-noodles-masala.jpg' },
  { name:'Maggi Oats Masala',         price:20,  mrp:20,  category:'instant',    description:'38g · Healthy oats noodles',         stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059590_3-maggi-oats-noodles-masala.jpg' },
  { name:'Sunfeast Pasta Masala',     price:30,  mrp:35,  category:'instant',    description:'65g · Masala pasta',                 stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059591_3-sunfeast-pasta-treat-masala.jpg' },
  { name:'Haldiram Dal Makhani',      price:70,  mrp:80,  category:'instant',    description:'300g · Ready to eat',                stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059592_3-haldirams-dal-makhani.jpg' },
  { name:'Gits Paneer Butter Masala', price:80,  mrp:90,  category:'instant',    description:'285g · Ready to eat',                stock:30,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059593_3-gits-paneer-butter-masala.jpg' },
  { name:'ITC Butter Chicken',        price:85,  mrp:95,  category:'instant',    description:'285g · Butter chicken curry',        stock:25,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059594_3-kitchens-of-india-butter-chicken.jpg' },

  // ── DAIRY (10 products) ──
  { name:'Amul Butter 100g',          price:55,  mrp:58,  category:'dairy',      description:'100g · Salted table butter',         stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059600_4-amul-butter.jpg' },
  { name:'Amul Milk 500ml',           price:30,  mrp:30,  category:'dairy',      description:'500ml · Full cream toned milk',      stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059601_3-amul-milk.jpg' },
  { name:'Amul Cheese Slice 10pc',    price:99,  mrp:110, category:'dairy',      description:'200g · Processed cheese slices',     stock:30,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059602_3-amul-cheese-slices.jpg' },
  { name:'Amul Dahi 200g',            price:30,  mrp:32,  category:'dairy',      description:'200g · Fresh curd',                  stock:45,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059603_3-amul-dahi.jpg' },
  { name:'Amul Cream 25ml',           price:20,  mrp:22,  category:'dairy',      description:'25ml · Fresh cream',                 stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059604_3-amul-cream.jpg' },
  { name:'Mother Dairy Milk 500ml',   price:28,  mrp:28,  category:'dairy',      description:'500ml · Double toned milk',          stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059605_3-mother-dairy-milk.jpg' },
  { name:'Epigamia Greek Yogurt',     price:55,  mrp:60,  category:'dairy',      description:'85g · Vanilla flavour yogurt',       stock:25,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40102160_3-epigamia-greek-yogurt-vanilla.jpg' },
  { name:'Nestle Milkmaid 400g',      price:95,  mrp:105, category:'dairy',      description:'400g · Sweetened condensed milk',    stock:30,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059606_3-nestle-milkmaid.jpg' },
  { name:'Britannia Cheese Spread',   price:80,  mrp:90,  category:'dairy',      description:'180g · Creamy cheese spread',        stock:25,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059607_3-britannia-cheese-spread.jpg' },
  { name:'Amul Lassi 200ml',          price:25,  mrp:25,  category:'dairy',      description:'200ml · Sweet lassi drink',          stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059608_3-amul-lassi.jpg' },

  // ── STATIONERY (10 products) ──
  { name:'Reynolds Blue Pen',         price:10,  mrp:10,  category:'stationery', description:'Pack of 1 · Smooth ballpoint',       stock:150, badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059620_3-reynolds-045-carbure-ball-pen.jpg' },
  { name:'Classmate Notebook 200pg',  price:45,  mrp:50,  category:'stationery', description:'200 pages · Ruled A4 notebook',     stock:60,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059621_3-classmate-notebook-200-pages.jpg' },
  { name:'Fevicol MR 50g',            price:30,  mrp:30,  category:'stationery', description:'50g · Strong adhesive',              stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059622_3-fevicol-mr.jpg' },
  { name:'Apsara Pencil HB 10pc',     price:30,  mrp:35,  category:'stationery', description:'Pack of 10 · HB pencils',            stock:100, badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059623_3-apsara-pencil-hb.jpg' },
  { name:'Natraj Eraser Pack 2',      price:5,   mrp:5,   category:'stationery', description:'Pack of 2 · White erasers',          stock:200, badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059624_3-natraj-eraser.jpg' },
  { name:'Cello Tape 1 inch',         price:20,  mrp:20,  category:'stationery', description:'1 inch · Clear adhesive tape',       stock:90,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059625_3-cello-tape.jpg' },
  { name:'Stapler with 1000 Pins',    price:60,  mrp:75,  category:'stationery', description:'Mini stapler with staple pins',      stock:40,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059626_3-stapler.jpg' },
  { name:'Highlighter Set 4 Colors',  price:80,  mrp:95,  category:'stationery', description:'Pack of 4 · Pastel highlighters',    stock:50,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059627_3-highlighter-set.jpg' },
  { name:'Flair Ball Pen 5pc',        price:40,  mrp:45,  category:'stationery', description:'Pack of 5 · Multicolor pens',        stock:70,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059628_3-flair-ball-pen.jpg' },
  { name:'A4 Paper 100 Sheets',       price:55,  mrp:60,  category:'stationery', description:'100 sheets · White A4 paper',        stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059629_3-a4-paper.jpg' },

  // ── MEDICINES (10 products) ──
  { name:'Glucose-D Orange 100g',     price:55,  mrp:60,  category:'medicines',  description:'100g · Energy glucose powder',       stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059640_3-glucose-d-orange.jpg' },
  { name:'Vicks VapoRub 10ml',        price:60,  mrp:65,  category:'medicines',  description:'10ml · Cold & cough relief',         stock:35,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059641_3-vicks-vaporub.jpg' },
  { name:'Band-Aid Flexible 10pc',    price:35,  mrp:40,  category:'medicines',  description:'10 strips · Flexible fabric strips', stock:60,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059642_3-band-aid-flexible.jpg' },
  { name:'Dettol Antiseptic 50ml',    price:55,  mrp:60,  category:'medicines',  description:'50ml · Antiseptic liquid',           stock:45,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059643_3-dettol-antiseptic.jpg' },
  { name:'Hajmola Candy 60pc',        price:25,  mrp:25,  category:'medicines',  description:'60 pieces · Digestive candy',        stock:80,  badge:'hot',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059644_3-hajmola-candy.jpg' },
  { name:'Eno Fruit Salt Regular',    price:30,  mrp:32,  category:'medicines',  description:'30g · Lemon flavour antacid',        stock:55,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059645_3-eno-fruit-salt.jpg' },
  { name:'ORS Electral Powder',       price:30,  mrp:35,  category:'medicines',  description:'21.8g · Oral rehydration salts',     stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059646_3-electral-powder.jpg' },
  { name:'Iodex Pain Relief 8g',      price:45,  mrp:50,  category:'medicines',  description:'8g · Fast pain relief balm',         stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059647_3-iodex-pain-relief.jpg' },
  { name:'Digene Gel Orange 200ml',   price:95,  mrp:105, category:'medicines',  description:'200ml · Antacid gel',                stock:30,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059648_3-digene-gel-orange.jpg' },
  { name:'Pudinhara Liquid 30ml',     price:35,  mrp:38,  category:'medicines',  description:'30ml · Peppermint digestive',        stock:45,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059649_3-pudinhara.jpg' },

  // ── HYGIENE (15 products) ──
  { name:'Dettol Soap 75g',           price:45,  mrp:50,  category:'hygiene',    description:'75g · Antiseptic protection',        stock:60,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059660_4-dettol-soap.jpg' },
  { name:'Colgate MaxFresh 150g',     price:99,  mrp:110, category:'hygiene',    description:'150g · Cool mint toothpaste',        stock:55,  badge:'deal',       image:'https://www.bigbasket.com/media/uploads/p/xxl/40059661_4-colgate-maxfresh.jpg' },
  { name:'Dove Soap 100g',            price:55,  mrp:60,  category:'hygiene',    description:'100g · Moisturising beauty bar',     stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059662_4-dove-soap.jpg' },
  { name:'Lifebuoy Soap 125g',        price:35,  mrp:38,  category:'hygiene',    description:'125g · Total germ protection',       stock:70,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059663_4-lifebuoy-soap.jpg' },
  { name:'Head & Shoulders 72ml',     price:99,  mrp:110, category:'hygiene',    description:'72ml · Anti-dandruff shampoo',       stock:35,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059664_4-head-shoulders-shampoo.jpg' },
  { name:'Pantene Shampoo 80ml',      price:85,  mrp:95,  category:'hygiene',    description:'80ml · Smooth & silky shampoo',      stock:40,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059665_4-pantene-shampoo.jpg' },
  { name:'Nivea Men Face Wash 50ml',  price:85,  mrp:99,  category:'hygiene',    description:'50ml · Oil control face wash',       stock:30,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059666_4-nivea-men-face-wash.jpg' },
  { name:'Listerine Mouthwash 80ml',  price:65,  mrp:75,  category:'hygiene',    description:'80ml · Cool mint mouthwash',         stock:40,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059667_4-listerine-mouthwash.jpg' },
  { name:'Gillette Mach3 Razor',      price:199, mrp:225, category:'hygiene',    description:'1 razor · 3 blade precision',        stock:25,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059668_4-gillette-mach3-razor.jpg' },
  { name:'Pepsodent Toothbrush',      price:30,  mrp:35,  category:'hygiene',    description:'1 brush · Soft bristles',            stock:80,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059669_4-pepsodent-toothbrush.jpg' },
  { name:'Parachute Coconut Oil 50ml',price:35,  mrp:38,  category:'hygiene',    description:'50ml · 100% pure coconut oil',       stock:65,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059670_4-parachute-coconut-oil.jpg' },
  { name:'Fogg Deodorant 120ml',      price:179, mrp:199, category:'hygiene',    description:'120ml · No gas deo',                 stock:30,  badge:'new',        image:'https://www.bigbasket.com/media/uploads/p/xxl/40059671_4-fogg-deodorant.jpg' },
  { name:'Rexona Deo 150ml',          price:165, mrp:185, category:'hygiene',    description:'150ml · 48hr protection deo',        stock:35,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059672_4-rexona-deodorant.jpg' },
  { name:'Sensodyne Toothpaste 70g',  price:115, mrp:130, category:'hygiene',    description:'70g · Sensitive teeth protection',   stock:30,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059673_4-sensodyne-toothpaste.jpg' },
  { name:'Whisper Ultra 6pc',         price:55,  mrp:60,  category:'hygiene',    description:'6 pads · Ultra thin pads',           stock:50,  badge:'',           image:'https://www.bigbasket.com/media/uploads/p/xxl/40059674_4-whisper-ultra.jpg' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('\n🌱 Seeding 100 products with real product images...\n');
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