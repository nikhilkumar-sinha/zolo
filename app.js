/*
   ZOLOFRESH - JavaScript Application Logic
   Author: Antigravity Code Assistant
   Features: State Management, LocalStorage DB, Cart Operations, Payment Validation, Confetti
*/

// --- DEFAULT PRODUCT SEED DATABASE ---
const DEFAULT_PRODUCTS = [
  // 1. Orchard Fruits
  {
    id: 'shahi-litchi',
    title: 'Certified Shahi Litchi',
    category: 'fruits',
    isGI: true,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    season: 'summer',
    price: 240,
    unit: 'Per Kg (approx. 40-45 units)',
    image: 'assets/shahi_litchi.jpg',
    origin: 'Muzaffarpur, Bihar',
    popularity: 98,
    inStock: true,
    description: 'Muzaffarpur\'s famous GI-tagged Shahi Litchi is legendary for its bright rose-pink outer shell, heavy perfume, and exceptionally sweet, translucent pulp.',
    heritageStory: 'Cultivated in the calcareous soil of Muzaffarpur fed by the Gandak River basin. The high calcium content of the land gives these litchis their signature rosy skin and unparalleled sweetness.'
  },
  {
    id: 'jardalu-mango',
    title: 'Bhagalpur Jardalu Mango',
    category: 'fruits',
    isGI: true,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    season: 'summer',
    price: 190,
    unit: 'Per Kg (approx. 4-5 units)',
    image: 'assets/jardalu_mango.jpg',
    origin: 'Bhagalpur, Bihar',
    popularity: 95,
    inStock: true,
    description: 'Famed for its unique sweet aroma and bright lemon-yellow skin, the Bhagalpur Jardalu Mango is a certified GI treasure with thin skin and fiberless saffron pulp.',
    heritageStory: 'Originally brought to Bhagalpur by the royals of Aliganj. Generations of farmers have preserved the graftings nourished by the alluvial silts of the Ganges.'
  },
  {
    id: 'organic-jamun',
    title: 'Wild Organic Jamun (Black Plum)',
    category: 'fruits',
    isGI: false,
    isOrganic: true,
    isSeasonal: true,
    isFamous: false,
    season: 'monsoon',
    price: 180,
    unit: 'Pack of 500g',
    image: '',
    origin: 'Muzaffarpur & Champaran',
    popularity: 85,
    inStock: true,
    description: 'Hand-picked wild monsoon Jamun. Deep purple, tangy-sweet, and renowned for its natural blood-sugar regulating and digestive health benefits.',
    heritageStory: 'Harvested from wild heritage trees in forest belts. Packed in eco-bamboo baskets to keep the tender fruit intact.'
  },

  // 2. Mithila Makhana
  {
    id: 'mithila-makhana',
    title: 'Premium Mithila Makhana',
    category: 'makhana',
    isGI: true,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'monsoon',
    price: 380,
    unit: 'Pack of 500g (Jumbo Size)',
    image: 'assets/mithila_makhana.jpg',
    origin: 'Mithila Region, Bihar',
    popularity: 94,
    inStock: true,
    description: 'GI-tagged Mithila Makhana (Phool Patasa) are high-grade popped foxnuts harvested from freshwater lotus ponds. Protein-rich, gluten-free superfood.',
    heritageStory: 'Farmers dive under water in Mithila ponds to extract seeds which are hand-roasted and popped over iron woks using heavy mallets.'
  },
  {
    id: 'bhuna-makhana',
    title: 'Bhuna Makhana (Roasted Foxnuts)',
    category: 'makhana',
    isGI: true,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'monsoon',
    price: 150,
    unit: 'Pack of 200g',
    image: 'assets/mithila_makhana.jpg',
    origin: 'Mithila Region, Bihar',
    popularity: 90,
    inStock: true,
    description: 'Lightly roasted, crispy Mithila Makhana seasoned with pink salt, pepper, and organic turmeric. A premium, guilt-free healthy snack.',
    heritageStory: 'Freshly harvested makhana roasted in slow sand pans to achieve the ultimate crunch without losing nutritional values.'
  },
  {
    id: 'makhana-kheer-kit',
    title: 'Mithila Makhana Kheer Mix',
    category: 'makhana',
    isGI: true,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'monsoon',
    price: 250,
    unit: 'Pack of 300g (Ready Pudding Mix)',
    image: 'assets/mithila_makhana.jpg',
    origin: 'Darbhanga, Mithila',
    popularity: 93,
    inStock: true,
    description: 'Gourmet pudding kit containing pre-roasted GI Mithila Makhana, saffron strands, green cardamom powder, cashew nuts, and raisins.',
    heritageStory: 'Makhana Kheer is the traditional festive dessert served across Mithila during Kojagara and auspicious family celebrations.'
  },

  // 3. Grains & Flours
  {
    id: 'katarni-rice',
    title: 'Fragrant Katarni Rice',
    category: 'grains',
    isGI: true,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'autumn',
    price: 130,
    unit: 'Pack of 1 Kg',
    image: 'assets/katarni_rice.jpg',
    origin: 'Jagdishpur, Bhagalpur',
    popularity: 88,
    inStock: true,
    description: 'Slender-grained, aromatic GI Katarni Rice famous for its unique texture, natural fragrance, and light digestibility. Ideal for Chura and Kheer.',
    heritageStory: 'Katarni Rice has a certified GI tag. The unique microclimate of Jagdishpur gives this rice its signature aroma.'
  },
  {
    id: 'bhagalpuri-rice',
    title: 'Bhagalpuri Rice',
    category: 'grains',
    isGI: false,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'autumn',
    price: 110,
    unit: 'Pack of 1 Kg',
    image: 'assets/katarni_rice.jpg',
    origin: 'Bhagalpur, Bihar',
    popularity: 87,
    inStock: true,
    description: 'Premium organic white grain rice sourced directly from cooperative farmers in the Bhagalpur floodplains. Daily staple grain.',
    heritageStory: 'Grown on fertile Gangetic plain lands using eco-compost fertilizers and harvested at maximum maturity.'
  },
  {
    id: 'chana-sattu',
    title: 'Chana ka Sattu (Gram Sattu)',
    category: 'grains',
    isGI: false,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'summer',
    price: 90,
    unit: 'Pack of 1 Kg',
    image: 'assets/traditional_sattu.jpg',
    origin: 'Buxar, Bihar',
    popularity: 90,
    inStock: true,
    description: 'Traditional Bihari Sattu made from dry-roasted black chana ground in slow stone mills (jaanta). High in plant protein and cooling digestive properties.',
    heritageStory: 'Sattu is Bihar\'s ancient peasant superfood. Stone grinding preserves the essential roasted aroma and digestive fiber.'
  },
  {
    id: 'chura-poha',
    title: 'Chura / Poha / Avlaki',
    category: 'grains',
    isGI: false,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'autumn',
    price: 80,
    unit: 'Pack of 500g',
    image: 'assets/katarni_rice.jpg',
    origin: 'Mithila Region, Bihar',
    popularity: 89,
    inStock: true,
    description: 'Crisp, flattened rice flakes prepared from premium aromatic Katarni paddy. Perfect for traditional Dahi-Chura breakfast offerings.',
    heritageStory: 'The Katarni paddy is soaked, roasted briefly, and beaten in traditional wooden mills to produce these highly aromatic flakes.'
  },

  // 4. Sweets & Delicacies
  {
    id: 'silao-khaja',
    title: 'Famous Silao Khaja (GI Tagged)',
    category: 'sweets',
    isGI: true,
    isOrganic: false,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 220,
    unit: 'Pack of 500g (12 Pieces)',
    image: 'assets/silao_khaja.jpg',
    origin: 'Silao, Nalanda',
    popularity: 97,
    inStock: true,
    description: 'GI-certified 52-layered wafer-thin crispy sweet from Silao. Delicately fried in desi ghee and dipped in light cardamom sugar syrup.',
    heritageStory: 'Legend says Lord Buddha and King Bimbisara enjoyed Silao Khaja. The unique water of Silao gives its dough an unmatched multi-layered crunch.'
  },
  {
    id: 'gaya-sesame-tilkut',
    title: 'Gaya Special Sesame Tilkut',
    category: 'sweets',
    isGI: false,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    season: 'winter',
    price: 280,
    unit: 'Pack of 500g',
    image: 'assets/gaya_tilkut.jpg',
    origin: 'Ramana Road, Gaya',
    popularity: 95,
    inStock: true,
    description: 'The world-famous winter sweet of Gaya. White sesame seeds and organic jaggery syrup pounded by hand into multi-layered crispy sheets that melt instantly.',
    heritageStory: 'Pounded using heavy iron hammers in the historic lanes of Gaya. Famous across India during Makar Sankranti.'
  },
  {
    id: 'chhath-thekua',
    title: 'Authentic Chhath Prasad Thekua',
    category: 'sweets',
    isGI: false,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    isFreshToday: true,
    season: 'winter',
    price: 240,
    unit: 'Pack of 500g (Approx 16-18 pcs)',
    image: 'assets/thekua.jpg',
    origin: 'Patna & Gaya, Bihar',
    popularity: 99,
    inStock: true,
    description: 'Sacred Bihari festive delicacy made with whole wheat flour, pure desi cow ghee, organic jaggery, cardamom, and dry fruits. Hand-molded using carved wooden dies.',
    heritageStory: 'The primary sacred offering during Chhath Puja. Slow-cooked over open wood fires to achieve a crispy, rich crust and long shelf life.'
  },
  {
    id: 'sesame-anarsa',
    title: 'Traditional Sesame Anarsa',
    category: 'sweets',
    isGI: false,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    isFreshToday: true,
    season: 'autumn',
    price: 260,
    unit: 'Pack of 500g',
    image: 'assets/anarsa.jpg',
    origin: 'Gaya & Mithila',
    popularity: 96,
    inStock: true,
    description: 'Crisp, golden-brown rice flour and jaggery/khoya sweet crusted with white sesame seeds. Soft and chewy on the inside, wonderfully crunchy outside.',
    heritageStory: 'A festival staple prepared during Diwali, Teej, and weddings. Soaked rice is coarsely ground, fermented with jaggery, and fried in pure ghee.'
  },
  {
    id: 'organic-jaggery',
    title: 'Organic Jaggery (Bheli)',
    category: 'sweets',
    isGI: false,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 120,
    unit: 'Pack of 1 Kg',
    image: 'assets/puja_box.jpg',
    origin: 'Patna Region, Bihar',
    popularity: 94,
    inStock: true,
    description: 'Pure, organic unrefined sugarcane jaggery (Gur/Bheli) made without chemical clarifiers. Dark, rich in iron, and naturally sweet.',
    heritageStory: 'Hand-pressed by cooperative farming groups using pure sugarcane juice boiled in large open iron pans.'
  },
  {
    id: 'traditional-sweets',
    title: 'Traditional Sweets',
    category: 'sweets',
    isGI: false,
    isOrganic: false,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 599,
    unit: 'Pack of 1 Kg',
    image: 'assets/Sweets.avif',
    origin: 'Bangalore/Banaras flavour',
    popularity: 92,
    inStock: true,
    description: 'Banarsi flavour Sweets.',
    heritageStory: 'A delightful blend of traditional recipes bringing the authentic rich taste and flavour of Banaras heritage sweets right to your doorstep.'
  },

  // 5. Sacred Puja Packages
  {
    id: 'diwali-puja-package',
    title: 'Diwali Sacred Puja Package',
    category: 'puja',
    isGI: false,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    season: 'winter',
    price: 450,
    unit: 'Complete Kit (12 items)',
    image: 'assets/puja_box.jpg',
    origin: 'Gaya & Patna, Bihar',
    popularity: 98,
    inStock: true,
    description: 'Special Diwali kit: Terracotta diyas, sacred Gangajal, yellow cowries, lotus seeds, pure cow ghee wicks, raw honey, and natural incense.',
    heritageStory: 'Assembled by priest cooperatives under strict rules of purification for home prosperity rituals.'
  },
  {
    id: 'durgapuja-package',
    title: 'Durga Puja Sacred Package',
    category: 'puja',
    isGI: false,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    season: 'autumn',
    price: 550,
    unit: 'Complete Kit (15 items)',
    image: 'assets/puja_box.jpg',
    origin: 'Mithila Region, Bihar',
    popularity: 97,
    inStock: true,
    description: 'Comprehensive Durga Puja items: Sandalwood paste, red chunri, barley seeds, sacred soil, dry fruits, copper kalash, and dhoop sticks.',
    heritageStory: 'Selected to match Mithila traditional rites for Navratri and Durga invocation.'
  },
  {
    id: 'satyanarayan-puja-package',
    title: 'Satyanarayan Bhagwan Puja Package',
    category: 'puja',
    isGI: false,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 380,
    unit: 'Complete Kit (10 items)',
    image: 'assets/puja_box.jpg',
    origin: 'Gaya Shrine Co-op',
    popularity: 95,
    inStock: true,
    description: 'Sacred kit for Satyanarayan Vrat: Panchamrit honey, tulsi seeds, janeyu thread, red-yellow mauli, camphor, and ritual story book.',
    heritageStory: 'Directly sourced from Gaya weavers and organic farms for family peace and vow fulfillment.'
  },

  // 6. Bihari Handlooms & Crafts
  {
    id: 'madhubani-paintings',
    title: 'Madhubani Paintings (GI Tagged)',
    category: 'crafts',
    isGI: true,
    isOrganic: false,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 650,
    unit: 'Handmade Canvas (A4 Size)',
    image: 'assets/mithila_makhana.jpg',
    origin: 'Madhubani, Mithila',
    popularity: 99,
    inStock: true,
    description: 'Authentic Madhubani art hand-painted by women cooperative artists using natural dye pigments on handmade paper canvas.',
    heritageStory: 'Dating back to the Ramayana era, Madhubani paintings capture folklore and nature motifs, utilizing finger, twig, and matchstick stroke techniques.'
  },
  {
    id: 'bhagalpuri-silk',
    title: 'Bhagalpuri Silk (Tussar Stole)',
    category: 'crafts',
    isGI: true,
    isOrganic: false,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 750,
    unit: 'Premium Silk Stole (2 Meters)',
    image: 'assets/katarni_rice.jpg',
    origin: 'Bhagalpur Silk Handloom',
    popularity: 96,
    inStock: true,
    description: '100% genuine, GI-certified Bhagalpuri Tussar Silk stole. Known for its rich texture, natural golden-beige shade, and structural resilience.',
    heritageStory: 'Bhagalpur is famously known as the "Silk City" of India. Tussar silk is woven in handlooms by traditional weaver families.'
  },
  {
    id: 'sikki-grass-craft',
    title: 'Sikki Grass Craft Basket',
    category: 'crafts',
    isGI: true,
    isOrganic: false,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 290,
    unit: 'Handwoven Utility Box',
    image: 'assets/puja_box.jpg',
    origin: 'Mithila Region, Bihar',
    popularity: 92,
    inStock: true,
    description: 'Golden Sikki Grass hand-braided utility basket. Light, organic, durable, and dyed in bright festive colors.',
    heritageStory: 'Sikki grass is a wild golden reed grown in Mithila. Braiding it into craft items is a traditional folk art passed down from mother to daughter.'
  },
  {
    id: 'kashmiri-kesar',
    title: 'Grade A++ Kashmiri Kesar (Saffron)',
    category: 'makhana',
    isGI: true,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'monsoon',
    price: 350,
    unit: 'Pack of 1 Gram',
    image: 'assets/puja_box.jpg',
    origin: 'Pampore, Kashmir',
    popularity: 98,
    inStock: true,
    description: 'GI-tagged Pampore Saffron (Lacha) of the highest grade. Unmatched deep color, robust aroma, and culinary potency.',
    heritageStory: 'Pampore fields are known as the "Saffron Bowl of Kashmir". Hand-plucked stigmas are dried under shade to preserve active crocin compounds.'
  },
  {
    id: 'darjeeling-tea',
    title: 'Darjeeling First Flush Black Tea',
    category: 'grains',
    isGI: true,
    isOrganic: true,
    isSeasonal: false,
    isFamous: true,
    season: 'autumn',
    price: 450,
    unit: 'Pack of 250g',
    image: 'assets/katarni_rice.jpg',
    origin: 'Darjeeling, West Bengal',
    popularity: 96,
    inStock: true,
    description: 'Certified organic Darjeeling Orthodox black tea. Delicate, floral first-flush tea with signature muscatel notes.',
    heritageStory: 'Grown at 6,000+ feet in the misty Himalayan foothills of Darjeeling, hand-rolled by tea garden workers.'
  },
  {
    id: 'mysore-sandalwood',
    title: 'Pure Mysore Sandalwood Oil',
    category: 'crafts',
    isGI: true,
    isOrganic: false,
    isSeasonal: false,
    isFamous: true,
    season: 'winter',
    price: 950,
    unit: 'Bottle of 5ml',
    image: 'assets/puja_box.jpg',
    origin: 'Mysore, Karnataka',
    popularity: 95,
    inStock: true,
    description: '100% pure, natural, and GI-certified Mysore Sandalwood oil. Distilled from mature heartwood with an exquisite warm-woody scent.',
    heritageStory: 'Mysore sandalwood holds a legendary status in royal cosmetics and wellness. Steam-distilled in traditional state distilleries.'
  },
  {
    id: 'alphonso-mango',
    title: 'Devgad Alphonso Hapus Mangoes',
    category: 'fruits',
    isGI: true,
    isOrganic: true,
    isSeasonal: true,
    isFamous: true,
    season: 'summer',
    price: 850,
    unit: 'Box of 6 Pieces',
    image: 'assets/jardalu_mango.jpg',
    origin: 'Devgad, Maharashtra',
    popularity: 99,
    inStock: true,
    description: 'Certified organic, naturally ripened Alphonso mangoes from Devgad orchards. Rich, saffron-toned pulp and sweet aroma.',
    heritageStory: 'Nurtured under the coastal sun of the Konkan region. Sourced directly from Devgad farmer co-operatives.'
  }
];

/// --- Database Seeding ---
function initializeLocalStorageDB() {
  // Safe version/cleanup wipe check to reload seed on taxonomy change or new products
  if (localStorage.getItem('kk_products')) {
    const existingProds = JSON.parse(localStorage.getItem('kk_products'));
    if (!existingProds.find(p => p.id === 'kashmiri-kesar') || !existingProds.find(p => p.id === 'traditional-sweets')) {
      localStorage.removeItem('kk_products');
      localStorage.removeItem('kk_categories');
      localStorage.removeItem('kk_product_images');
      localStorage.removeItem('kk_product_inventory');
      localStorage.removeItem('kk_product_attributes');
      localStorage.removeItem('kk_product_variants');
      localStorage.removeItem('kk_product_tags');
      localStorage.removeItem('kk_seasonal_availability');
      localStorage.removeItem('kk_product_seo');
    }
  }

  // 1. Categories Table
  if (!localStorage.getItem('kk_categories')) {
    const categories = [
      // Parent categories (id 1 to 5)
      { id: 1, category_name: 'Fruits & Fresh Produce', slug: 'fruits-fresh-produce', parent_id: null, status: true },
      { id: 2, category_name: 'Staples & Grains', slug: 'staples-grains', parent_id: null, status: true },
      { id: 3, category_name: 'Superfoods & Snacks', slug: 'superfoods-snacks', parent_id: null, status: true },
      { id: 4, category_name: 'Handlooms & Handicrafts', slug: 'handlooms-handicrafts', parent_id: null, status: true },
      { id: 5, category_name: 'Puja Essentials & Kits', slug: 'puja-essentials-kits', parent_id: null, status: true },
      
      // Subcategories (id 6 to 26)
      { id: 6, category_name: 'Shahi Litchi', slug: 'shahi-litchi', parent_id: 1, status: true },
      { id: 7, category_name: 'Jardalu Mango', slug: 'jardalu-mango', parent_id: 1, status: true },
      { id: 8, category_name: 'Katarni Rice', slug: 'katarni-rice', parent_id: 2, status: true },
      { id: 9, category_name: 'Bhagalpuri Rice', slug: 'bhagalpuri-rice', parent_id: 2, status: true },
      { id: 10, category_name: 'Chana Ka Sattu', slug: 'chana-ka-sattu', parent_id: 2, status: true },
      { id: 11, category_name: 'Chura / Poha', slug: 'chura-poha', parent_id: 2, status: true },
      { id: 12, category_name: 'Mithila Makhana', slug: 'mithila-makhana', parent_id: 3, status: true },
      { id: 13, category_name: 'Bhuna Makhana', slug: 'bhuna-makhana', parent_id: 3, status: true },
      { id: 14, category_name: 'Silao Khaja', slug: 'silao-khaja', parent_id: 3, status: true },
      { id: 15, category_name: 'Tilkut', slug: 'tilkut', parent_id: 3, status: true },
      { id: 16, category_name: 'Thekua', slug: 'thekua', parent_id: 3, status: true },
      { id: 17, category_name: 'Jaggery', slug: 'jaggery', parent_id: 3, status: true },
      { id: 18, category_name: 'Traditional Sweets', slug: 'traditional-sweets', parent_id: 3, status: true },
      { id: 19, category_name: 'Madhubani Paintings', slug: 'madhubani-paintings', parent_id: 4, status: true },
      { id: 20, category_name: 'Bhagalpuri Silk', slug: 'bhagalpuri-silk', parent_id: 4, status: true },
      { id: 21, category_name: 'Sikki Grass Craft', slug: 'sikki-grass-craft', parent_id: 4, status: true },
      { id: 22, category_name: 'Diwali Puja Kit', slug: 'diwali-puja-kit', parent_id: 5, status: true },
      { id: 23, category_name: 'Durga Puja Kit', slug: 'durga-puja-kit', parent_id: 5, status: true },
      { id: 24, category_name: 'Satyanarayan Puja Kit', slug: 'satyanarayan-puja-kit', parent_id: 5, status: true }
    ];
    localStorage.setItem('kk_categories', JSON.stringify(categories));
  }

  // 2. Products Table and related normalized child tables
  if (!localStorage.getItem('kk_products')) {
    const products = [];
    const images = [];
    const inventory = [];
    const attributes = [];
    const variants = [];
    const tags = [];
    const seasonal = [];
    const seo = [];

    // Helper to generate SKU based on naming conventions
    function generateSKU(prodId, title) {
      if (prodId.includes('litchi')) return 'USE-LIT-001';
      if (prodId.includes('mango')) return 'USE-MNG-001';
      if (prodId.includes('makhana')) return 'USE-MAK-001';
      if (prodId.includes('sattu')) return 'USE-SAT-001';
      if (prodId.includes('rice')) return 'USE-RIC-001';
      if (prodId.includes('jamun')) return 'USE-JAM-001';
      if (prodId.includes('tilkut')) return 'USE-TIL-001';
      if (prodId.includes('khaja')) return 'USE-KHA-001';
      if (prodId.includes('ladoo')) return 'USE-LAD-001';
      if (prodId.includes('thekua')) return 'USE-THE-001';
      if (prodId.includes('turmeric')) return 'USE-TUR-001';
      
      const words = title.toUpperCase().replace(/[^A-Z ]/g, '').split(' ');
      const prefix = words.length > 1 ? (words[0].substring(0, 1) + words[1].substring(0, 2)) : words[0].substring(0, 3);
      return `USE-${prefix.padEnd(3, 'X')}-001`;
    }

    // Map product unique slug to subcategory ID
    const catSlugToSubcatId = {
      'shahi-litchi': 6,
      'jardalu-mango': 7,
      'organic-jamun': 1,
      'mithila-makhana': 12,
      'bhuna-makhana': 13,
      'makhana-kheer-kit': 18,
      'katarni-rice': 8,
      'bhagalpuri-rice': 9,
      'chana-sattu': 10,
      'chura-poha': 11,
      'silao-khaja': 14,
      'gaya-sesame-tilkut': 15,
      'chhath-thekua': 16,
      'sesame-anarsa': 18,
      'organic-jaggery': 17,
      'diwali-puja-package': 22,
      'durgapuja-package': 23,
      'satyanarayan-puja-package': 24,
      'madhubani-paintings': 19,
      'bhagalpuri-silk': 20,
      'sikki-grass-craft': 21,
      'kashmiri-kesar': 12,
      'darjeeling-tea': 8,
      'mysore-sandalwood': 20,
      'alphonso-mango': 7
    };

    DEFAULT_PRODUCTS.forEach((p, index) => {
      const dbId = index + 1;
      const sku = generateSKU(p.id, p.title);
      const catId = catSlugToSubcatId[p.id] || 1;

      // Core product record
      products.push({
        id: dbId,
        sku: sku,
        product_title: p.title,
        slug: p.id,
        short_description: p.description,
        full_description: p.description + " Hand-packed with care by our farmer cooperatives in Bihar.",
        category_id: catId,
        origin_region: p.origin || 'Bihar, India',
        unit: p.unit.split(' ')[0] || 'Pack',
        package_size: p.unit || 'Standard Package',
        price: p.price,
        sale_price: p.price - 20 > 0 ? p.price - 20 : p.price,
        cost_price: Math.round(p.price * 0.6),
        tax: 5.00,
        brand: 'ZOLOFRESH',
        featured: p.popularity > 90,
        organic: p.isOrganic || false,
        gi_tagged: p.isGI || false,
        seasonal: p.isSeasonal || false,
        harvest_season: p.season || 'Winter',
        shelf_life: '15 Days',
        weight: 1.00,
        image: p.image || '',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Images
      images.push({
        id: dbId,
        product_id: dbId,
        image_url: p.image || '',
        alt_text: p.title,
        sort_order: 1
      });

      // Inventory
      inventory.push({
        id: dbId,
        product_id: dbId,
        sku: sku,
        stock_quantity: p.inStock ? 120 : 0,
        reserved_stock: 0,
        minimum_stock: 15,
        maximum_stock: 1000,
        stock_status: p.inStock ? 'In Stock' : 'Out of Stock',
        availability: p.inStock,
        warehouse: 'Patna Main Warehouse',
        updated_at: new Date().toISOString()
      });

      // Attributes
      attributes.push({ id: attributes.length + 1, product_id: dbId, attribute_name: 'Organic', attribute_value: p.isOrganic ? 'Yes' : 'No' });
      attributes.push({ id: attributes.length + 1, product_id: dbId, attribute_name: 'GI Tagged', attribute_value: p.isGI ? 'Yes' : 'No' });
      attributes.push({ id: attributes.length + 1, product_id: dbId, attribute_name: 'Seasonal', attribute_value: p.isSeasonal ? 'Yes' : 'No' });

      // Variants
      variants.push({ id: variants.length + 1, product_id: dbId, sku: sku + '-500', variant_name: '500g Pack', weight: '500g', price: p.price, stock: 60 });
      variants.push({ id: variants.length + 1, product_id: dbId, sku: sku + '-1000', variant_name: '1 Kg Pack', weight: '1 Kg', price: p.price * 1.8, stock: 60 });

      // Tags
      if (p.isOrganic) tags.push({ id: tags.length + 1, product_id: dbId, tag: 'Organic' });
      if (p.isGI) tags.push({ id: tags.length + 1, product_id: dbId, tag: 'GI Tagged' });
      if (p.isSeasonal) tags.push({ id: tags.length + 1, product_id: dbId, tag: p.season || 'Summer' });

      // Seasonal Availability
      seasonal.push({
        id: dbId,
        product_id: dbId,
        available_from: '2026-04-01',
        available_to: '2026-11-30',
        season: p.season || 'Summer',
        preorder_allowed: true
      });

      // SEO
      seo.push({
        id: dbId,
        product_id: dbId,
        meta_title: `${p.title} - Authentic Bihari Produce`,
        meta_description: p.description,
        meta_keywords: `${p.title}, Bihar organic, GI tagged, ${p.origin}`,
        canonical_url: `https://usemadi.com/products/${p.id}`
      });
    });

    localStorage.setItem('kk_products', JSON.stringify(products));
    localStorage.setItem('kk_product_images', JSON.stringify(images));
    localStorage.setItem('kk_product_inventory', JSON.stringify(inventory));
    localStorage.setItem('kk_product_attributes', JSON.stringify(attributes));
    localStorage.setItem('kk_product_variants', JSON.stringify(variants));
    localStorage.setItem('kk_product_tags', JSON.stringify(tags));
    localStorage.setItem('kk_seasonal_availability', JSON.stringify(seasonal));
    localStorage.setItem('kk_product_seo', JSON.stringify(seo));
  }

  if (!localStorage.getItem('kk_orders')) {
    localStorage.setItem('kk_orders', JSON.stringify([]));
  }
}
initializeLocalStorageDB();

// Pull live state from LocalStorage with relational mapping joins and dynamic parent slug resolver
function getProductsFromDB() {
  const products = JSON.parse(localStorage.getItem('kk_products')) || [];
  const inventory = JSON.parse(localStorage.getItem('kk_product_inventory')) || [];
  const categories = JSON.parse(localStorage.getItem('kk_categories')) || [];

  return products.map(p => {
    const inv = inventory.find(i => i.product_id === p.id) || {};
    const cat = categories.find(c => c.id === p.category_id) || {};
    
    // Find parent category slug for storefront tab categories compatibility
    let parentSlug = cat.slug;
    if (cat.parent_id !== null) {
      const parent = categories.find(c => c.id === cat.parent_id);
      if (parent) {
        parentSlug = parent.slug;
      }
    }

    return {
      id: p.slug,
      title: p.product_title,
      category: parentSlug || 'fruits-fresh-produce',
      isGI: p.gi_tagged,
      isOrganic: p.organic,
      isSeasonal: p.seasonal,
      season: p.harvest_season || 'winter',
      price: p.price,
      unit: p.package_size || 'Standard Unit',
      image: p.image,
      origin: p.origin_region,
      popularity: p.featured ? 95 : 80,
      inStock: inv.stock_quantity > 0,
      description: p.short_description,
      heritageStory: p.full_description
    };
  });
}

// --- Heritage Stories Database ---
const HERITAGE_STORIES = {
  litchi: {
    title: 'The Rose-Scented Shahi Litchi of Muzaffarpur',
    region: 'Muzaffarpur District',
    image: 'assets/shahi_litchi.jpg',
    content: `
      <p>The Shahi Litchi of Muzaffarpur is arguably India's celebrated summer fruit. Awarded the Geographical Indication (GI) tag in 2018, this unique variety is distinguished by its thin, bright pink-red skin, heavy rose perfume, and remarkably sweet, juicy pulp.</p>
      <p>What makes Muzaffarpur the global capital for this fruit? The answer lies in the soil. The land surrounding the Gandak and Budhi Gandak rivers is high in calcium carbonate and organic silt. Combined with a specific relative humidity during the fruiting season in May, the trees produce fruit with high water content and low acid level.</p>
      <p>At ZOLOFRESH, we partner directly with generational growers in orchards like Mushahari and Minapur. Litchis are highly perishable; they are harvested under the cool morning sky before the sun can dry their juices, pre-cooled, and flown to distribution channels within 24 hours of harvest.</p>
    `
  },
  mango: {
    title: 'The Golden Legacy of Jardalu Mangoes',
    region: 'Bhagalpur District',
    image: 'assets/jardalu_mango.jpg',
    content: `
      <p>While India boasts many mangoes, the Jardalu Mango of Bhagalpur stands alone for its captivating aroma. A sniff of a ripe Jardalu is a blend of honey, earth, and fresh grass. It is bright yellow, medium-sized, and possesses a light, fiberless pulp that is incredibly easy to eat.</p>
      <p>The history of Jardalu dates back to Maharaja Rehmat Ali Khan Bahadur of Aliganj, who planted the first grafts in Bhagalpur. The fertile floodplains of the River Ganges deposit nutrient-rich silts annually, providing the trees with a unique mineral diet. The GI tag guarantees that any mango sold as Jardalu must come from this geographically specific region.</p>
      <p>Our farmers harvest the mangoes when they are "semi-ripe" (showing a hint of yellow blush) so they ripen naturally during transit without the use of harmful calcium carbide gas, ensuring you get organic, safe-to-eat royal mangoes.</p>
    `
  },
  makhana: {
    title: 'Mithila Makhana: The Pond-Grown Superfood',
    region: 'Mithila Region (Darbhanga, Madhubani)',
    image: 'assets/mithila_makhana.jpg',
    content: `
      <p>Makhana, or popped foxnuts, are the seeds of the Euryale ferox water plant. While now praised globally as a high-protein, low-calorie superfood, it has been cultivated in the wetlands of the Mithila region for thousands of years.</p>
      <p>The cultivation of Makhana is an extraordinary demonstration of human endurance. Farmers stand chest-deep in muddy pond waters under the sun, using bamboo nets to scoop up seed pods from the pond bed. The seeds are then washed, dried, roasted in iron pans, and popped one by one using a heavy wooden hammer over hot sand.</p>
      <p>ZOLOFRESH supports the Mithila cooperative societies, ensuring that the farmers who perform this intense manual labor receive fair, direct wages, keeping this ancient, sustainable wetland farming alive.</p>
    `
  }
};

// --- Application State ---
let cart = [];
let appliedCoupon = null;
let checkoutStep = 1;

// --- DOM Selector Cache ---
const elements = {
  header: document.getElementById('header'),
  productGrid: document.getElementById('product-grid'),
  catalogSearch: document.getElementById('catalog-search'),
  catalogSort: document.getElementById('catalog-sort'),
  categoryBtns: document.querySelectorAll('.category-btn'),
  cartDrawerBtn: document.getElementById('cart-drawer-btn'),
  cartOverlay: document.getElementById('cart-overlay'),
  closeCartBtn: document.getElementById('close-cart-btn'),
  cartItemsWrapper: document.getElementById('cart-items-wrapper'),
  cartCounter: document.getElementById('cart-counter'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  discountRow: document.getElementById('discount-row'),
  cartDiscount: document.getElementById('cart-discount'),
  cartShipping: document.getElementById('cart-shipping'),
  cartGrandtotal: document.getElementById('cart-grandtotal'),
  couponInput: document.getElementById('coupon-code-input'),
  applyCouponBtn: document.getElementById('apply-coupon-btn'),
  couponMsg: document.getElementById('coupon-msg'),
  checkoutTriggerBtn: document.getElementById('checkout-trigger-btn'),
  productModal: document.getElementById('product-modal'),
  closeProductModalBtn: document.getElementById('close-product-modal-btn'),
  productModalGridContent: document.getElementById('product-modal-grid-content'),
  storyModal: document.getElementById('story-modal'),
  closeStoryModalBtn: document.getElementById('close-story-modal-btn'),
  storyModalInnerContent: document.getElementById('story-modal-inner-content'),
  checkoutModal: document.getElementById('checkout-modal'),
  closeCheckoutModalBtn: document.getElementById('close-checkout-modal-btn'),
  checkoutForm: document.getElementById('checkout-form'),
  checkoutNextBtn: document.getElementById('checkout-next-btn'),
  checkoutBackBtn: document.getElementById('checkout-back-btn'),
  checkoutNavBtns: document.getElementById('checkout-nav-btns'),
  checkoutOrderBreakdown: document.getElementById('checkout-order-breakdown'),
  checkoutTotalToPay: document.getElementById('checkout-total-to-pay'),
  successOrderId: document.getElementById('success-order-id'),
  seasonTabBtns: document.querySelectorAll('.season-tab-btn'),
  seasonContentPanes: document.querySelectorAll('.season-content-pane')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog(getProductsFromDB());
  setupEventListeners();
  loadCartFromStorage();
  lucide.createIcons(); // Hydrate Lucide Icons
});

// --- HELPER: Renders custom visual cards for products without images ---
function getProductImageHTML(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.title}" class="product-card-image" loading="lazy">`;
  }
  
  let icon = 'sparkles';
  let gradient = 'linear-gradient(135deg, #2E5A44 0%, #D47A3B 100%)';
  
  if (product.category === 'puja' || product.id.includes('puja') || product.id.includes('soop') || product.id.includes('ganga')) {
    icon = 'flame';
    gradient = 'linear-gradient(135deg, #C23B22 0%, #D47A3B 50%, #FF8C00 100%)';
  } else if (product.category === 'famous' || product.id.includes('khaja') || product.id.includes('tilkut') || product.id.includes('ladoo')) {
    icon = 'crown';
    gradient = 'linear-gradient(135deg, #1D3557 0%, #457B9D 50%, #D4AF37 100%)';
  } else if (product.category === 'seasonal' || product.id.includes('malda') || product.id.includes('jamun') || product.id.includes('sathi')) {
    icon = 'sun';
    gradient = 'linear-gradient(135deg, #E76F51 0%, #F4A261 100%)';
  } else if (product.id.includes('jaggery') || product.id.includes('bheli')) {
    icon = 'candy';
    gradient = 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)';
  }

  return `
    <div class="puja-image-fallback" style="background: ${gradient};">
      <i data-lucide="${icon}" style="width: 48px; height: 48px; color: var(--color-gold);"></i>
      <span style="color: #FFF; font-weight: 700; font-size: 1.1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.4); text-align: center; padding: 0 12px;">${product.title}</span>
    </div>
  `;
}

// --- CATALOG RENDERING & LOGIC ---
function renderCatalog(productsToRender) {
  elements.productGrid.innerHTML = '';
  
  if (productsToRender.length === 0) {
    elements.productGrid.innerHTML = `
      <div class="no-results">
        <i data-lucide="search-slash" style="width: 48px; height: 48px; stroke-width: 1.5;"></i>
        <h3>No Products Found</h3>
        <p>Try adjusting your search keywords or filter category.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  productsToRender.forEach(product => {
    const card = document.createElement('div');
    card.className = `product-card ${!product.inStock ? 'sold-out' : ''}`;
    card.setAttribute('data-id', product.id);

    // Build Category Badges HTML
    let badgeHTML = '';
    if (!product.inStock) {
      badgeHTML = `<span class="product-badge badge-sold-out" style="background-color: var(--color-text-muted);">Sold Out</span>`;
    } else if (product.category === 'puja') {
      badgeHTML = `<span class="product-badge badge-puja">🪔 Puja Special</span>`;
    } else if (product.category === 'famous' || product.isFamous) {
      badgeHTML = `<span class="product-badge badge-famous">🏆 Bihar Famous</span>`;
    } else if (product.isGI) {
      badgeHTML = `<span class="product-badge badge-heritage">🏷️ GI Tagged</span>`;
    } else if (product.category === 'seasonal' || product.isSeasonal) {
      badgeHTML = `<span class="product-badge badge-seasonal">☀️ Seasonal</span>`;
    } else {
      badgeHTML = `<span class="product-badge badge-organic">🌿 100% Organic</span>`;
    }

    const originalPrice = Math.round(product.price * 1.25);
    const ratingScore = (4.7 + (product.popularity % 4) * 0.1).toFixed(1);

    card.innerHTML = `
      <div class="product-image-container">
        ${badgeHTML}
        <button class="wishlist-btn" onclick="showToast('Added to Wishlist!', 'info')" aria-label="Add to Wishlist"><i data-lucide="heart"></i></button>
        ${getProductImageHTML(product)}
        <div class="product-quick-view-overlay">
          <button class="btn-quick-view" onclick="openProductQuickView('${product.id}')">Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="product-cat-tag">${product.category.toUpperCase()} • ${product.origin}</span>
          <span class="product-star-rating"><i data-lucide="star" style="width: 13px; height: 13px; fill: #F59E0B; color: #F59E0B; display: inline;"></i> ${ratingScore}</span>
        </div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description-excerpt">${product.description}</p>
        <div class="product-footer">
          <div class="product-price-wrapper">
            <span class="product-price">₹${product.price}</span>
            <span class="product-original-price">₹${originalPrice}</span>
            <span class="product-unit-small">${product.unit}</span>
          </div>
          ${product.inStock 
            ? `<button class="btn-add-mint" onclick="addToCart('${product.id}')" aria-label="Add to cart"><i data-lucide="shopping-bag" style="width:14px; height:14px;"></i> Add</button>`
            : `<button class="btn-add-mint" disabled style="background-color:#E2E8F0; color:#94A3B8; cursor:not-allowed;">Sold</button>`
          }
        </div>
      </div>
    `;
    elements.productGrid.appendChild(card);
  });

  lucide.createIcons();
}

// Search and Filter handler
function handleFilterSearch() {
  const searchQuery = elements.catalogSearch.value.toLowerCase().trim();
  const activeBtn = document.querySelector('.category-btn.active');
  const activeCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
  const sortVal = elements.catalogSort.value;
  const products = getProductsFromDB();

  let filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery) ||
                          p.origin.toLowerCase().includes(searchQuery) ||
                          p.description.toLowerCase().includes(searchQuery);
    
    let matchesCategory = true;
    if (activeCategory !== 'all') {
      matchesCategory = p.category === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  // Apply Sorting
  if (sortVal === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortVal === 'popular') {
    filtered.sort((a, b) => b.popularity - a.popularity);
  }

  renderCatalog(filtered);
}

// --- SHOPPING CART OPERATIONS ---
function loadCartFromStorage() {
  const savedCart = localStorage.getItem('kk_cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartUI();
    } catch(e) {
      cart = [];
    }
  }
}

function saveCartToStorage() {
  localStorage.setItem('kk_cart', JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
  const products = getProductsFromDB();
  const product = products.find(p => p.id === productId);
  if (!product || !product.inStock) return;

  const existingItem = cart.find(item => item.product.id === productId);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ product, quantity: qty });
  }

  saveCartToStorage();
  updateCartUI();
  
  // Show toast notification instead of sliding open cart drawer aggressively
  showToast(`Added ${product.title} to your basket!`);
  
  // Micro-animation badge bounce
  elements.cartCounter.classList.add('bounce');
  setTimeout(() => elements.cartCounter.classList.remove('bounce'), 300);
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.product.id !== productId);
  }
  
  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  elements.cartCounter.textContent = totalItems;

  const floatingCart = document.getElementById('floating-cart');
  if (floatingCart) {
    if (totalItems > 0) {
      floatingCart.style.display = 'flex';
      const floatingCartCounter = document.getElementById('floating-cart-counter');
      if (floatingCartCounter) floatingCartCounter.textContent = totalItems;
    } else {
      floatingCart.style.display = 'none';
    }
  }

  if (cart.length === 0) {
    elements.cartItemsWrapper.innerHTML = `
      <div class="cart-empty-state">
        <i data-lucide="shopping-cart" style="width: 48px; height: 48px;"></i>
        <p>Your basket is currently empty.</p>
        <a href="#shop" class="btn btn-primary" style="margin-top: 16px;" onclick="document.getElementById('cart-overlay').classList.remove('open');">Browse Harvest</a>
      </div>
    `;
    elements.cartSubtotal.textContent = '₹0.00';
    elements.cartShipping.textContent = '₹0.00';
    elements.cartGrandtotal.textContent = '₹0.00';
    elements.discountRow.style.display = 'none';
    elements.checkoutTriggerBtn.disabled = true;
    lucide.createIcons();
    return;
  }

  elements.checkoutTriggerBtn.disabled = false;
  elements.cartItemsWrapper.innerHTML = '';

  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    
    let imageHTML = item.product.image 
      ? `<img src="${item.product.image}" alt="${item.product.title}" class="cart-item-image">`
      : `<div class="cart-item-image" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:0.6rem; font-weight:bold; text-align:center; padding: 2px;">${item.product.title.split(' ')[0]}</div>`;

    itemDiv.innerHTML = `
      ${imageHTML}
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.product.title}</h4>
        <span class="cart-item-origin">${item.product.origin}</span>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button class="btn-qty" onclick="updateCartQuantity('${item.product.id}', -1)" aria-label="Decrease quantity">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="btn-qty" onclick="updateCartQuantity('${item.product.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <span class="cart-item-price-unit">₹${itemTotal}</span>
          <button class="btn-remove-item" onclick="removeFromCart('${item.product.id}')" aria-label="Remove item">
            <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
          </button>
        </div>
      </div>
    `;
    elements.cartItemsWrapper.appendChild(itemDiv);
  });

  // Calculate pricing math
  let discount = 0;
  if (appliedCoupon === 'BIHAR10') {
    discount = subtotal * 0.1;
  } else if (appliedCoupon === 'PUJA20') {
    const hasPuja = cart.some(item => item.product.category === 'puja');
    if (hasPuja) {
      discount = subtotal * 0.2;
    } else {
      appliedCoupon = null;
      elements.couponMsg.textContent = 'Puja coupon requires at least one Puja item in cart.';
      elements.couponMsg.className = 'coupon-status error';
    }
  }

  const shipping = getDeliveryCost(subtotal);
  const grandtotal = subtotal - discount + shipping;

  elements.cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  elements.cartShipping.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
  elements.cartGrandtotal.textContent = `₹${grandtotal.toFixed(2)}`;

  if (discount > 0) {
    elements.discountRow.style.display = 'flex';
    elements.cartDiscount.textContent = `-₹${discount.toFixed(2)}`;
  } else {
    elements.discountRow.style.display = 'none';
  }

  if (floatingCart && totalItems > 0) {
    const floatingCartList = document.getElementById('floating-cart-list');
    const floatingCartTotal = document.getElementById('floating-cart-total');
    if (floatingCartTotal) floatingCartTotal.textContent = `₹${subtotal.toFixed(2)}`;

    if (floatingCartList) {
      floatingCartList.innerHTML = '';
      cart.forEach(item => {
        const itemLi = document.createElement('li');
        itemLi.className = 'floating-cart-item';
        
        let imageHTML = item.product.image 
          ? `<img src="${item.product.image}" alt="${item.product.title}" class="floating-cart-item-img">`
          : `<div class="floating-cart-item-img" style="background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:0.5rem; font-weight:bold; text-align:center;">${item.product.title.split(' ')[0]}</div>`;
          
        itemLi.innerHTML = `
          ${imageHTML}
          <div class="floating-cart-item-details">
            <h5>${item.product.title}</h5>
            <span>Qty: ${item.quantity}</span>
          </div>
          <div class="floating-cart-item-price">₹${item.product.price * item.quantity}</div>
        `;
        floatingCartList.appendChild(itemLi);
      });
    }
  }

  lucide.createIcons();
}

// Promo Code Apply
function handleApplyCoupon() {
  const code = elements.couponInput.value.toUpperCase().trim();
  
  if (code === 'BIHAR10') {
    appliedCoupon = 'BIHAR10';
    elements.couponMsg.textContent = '10% off applied on Bihar Goods!';
    elements.couponMsg.className = 'coupon-status success';
  } else if (code === 'PUJA20') {
    const hasPuja = cart.some(item => item.product.category === 'puja');
    if (hasPuja) {
      appliedCoupon = 'PUJA20';
      elements.couponMsg.textContent = '20% Puja discount applied!';
      elements.couponMsg.className = 'coupon-status success';
    } else {
      elements.couponMsg.textContent = 'Cart must contain at least one Puja item.';
      elements.couponMsg.className = 'coupon-status error';
    }
  } else {
    elements.couponMsg.textContent = 'Invalid promo code.';
    elements.couponMsg.className = 'coupon-status error';
  }
  
  updateCartUI();
}

function openCartDrawer() {
  elements.cartOverlay.classList.add('open');
}

function closeCartDrawer() {
  elements.cartOverlay.classList.remove('open');
}

// --- MODALS ENGINE ---
function openProductQuickView(productId) {
  const products = getProductsFromDB();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.title}" class="product-modal-image">`
    : `
      <div class="puja-image-fallback" style="height: 100%; min-height: 400px; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)">
        <i data-lucide="sparkles" style="width: 72px; height: 72px; color: var(--color-gold); margin-bottom: 16px;"></i>
        <span style="font-size: 1.5rem;">${product.title}</span>
      </div>
    `;

  let badgesHTML = '';
  if (!product.inStock) badgesHTML += `<span class="product-badge badge-sold-out" style="position:relative; top:0; left:0; background-color:#6B5D55;">Sold Out</span>`;
  if (product.isGI) badgesHTML += `<span class="product-badge badge-heritage" style="position:relative; top:0; left:0;">GI Tagged</span>`;
  if (product.isOrganic) badgesHTML += `<span class="product-badge badge-organic" style="position:relative; top:0; left:0;">100% Organic</span>`;
  if (product.isSeasonal) badgesHTML += `<span class="product-badge badge-seasonal" style="position:relative; top:0; left:0;">Seasonal (${product.season})</span>`;

  elements.productModalGridContent.innerHTML = `
    <div class="product-modal-image-wrapper">
      ${imageHTML}
    </div>
    <div class="product-modal-details">
      <span class="product-modal-origin">${product.origin}</span>
      <h3 class="product-modal-title">${product.title}</h3>
      <div class="product-modal-badges">${badgesHTML}</div>
      <p class="product-modal-description">${product.description}</p>
      
      <div class="product-heritage-story-box">
        <h5>Harvest legacy</h5>
        <p>"${product.heritageStory}"</p>
      </div>

      <div class="product-modal-price-selector">
        <div class="product-modal-price-info">
          <span class="product-modal-price">₹${product.price}</span>
          <span class="product-modal-unit">${product.unit}</span>
        </div>
        <div class="product-modal-actions">
          ${product.inStock 
            ? `<button class="btn btn-primary" onclick="addToCart('${product.id}'); document.getElementById('product-modal').classList.remove('open');">Add to Basket <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i></button>`
            : `<button class="btn btn-primary" disabled style="background-color:#E8E2D9; color:#A09088; cursor:not-allowed;">Sold Out <i data-lucide="slash" style="width: 16px; height: 16px;"></i></button>`
          }
        </div>
      </div>
    </div>
  `;

  elements.productModal.classList.add('open');
  lucide.createIcons();
}

function openStoryModal(storyId) {
  const story = HERITAGE_STORIES[storyId];
  if (!story) return;

  elements.storyModalInnerContent.innerHTML = `
    <div class="story-header-image">
      <img src="${story.image}" alt="${story.title}">
    </div>
    <span class="story-modal-region">${story.region}</span>
    <h3>${story.title}</h3>
    <div class="story-body">
      ${story.content}
    </div>
  `;

  elements.storyModal.classList.add('open');
}

// --- CHECKOUT WIZARD PROCESS ---
function openCheckoutWizard() {
  if (cart.length === 0) return;
  
  closeCartDrawer();
  checkoutStep = 1;
  updateCheckoutStepUI();
  elements.checkoutModal.classList.add('open');
}

function updateCheckoutStepUI() {
  document.querySelectorAll('.checkout-pane').forEach(pane => pane.classList.remove('active'));
  document.getElementById(`checkout-step-${checkoutStep}`).classList.add('active');

  document.querySelectorAll('.step-indicator').forEach(indicator => {
    const step = parseInt(indicator.getAttribute('data-step'));
    indicator.classList.remove('active', 'completed');
    if (step === checkoutStep) {
      indicator.classList.add('active');
    } else if (step < checkoutStep) {
      indicator.classList.add('completed');
    }
  });

  // Configure navigation buttons
  elements.checkoutNavBtns.style.display = 'flex';
  if (checkoutStep === 1) {
    elements.checkoutBackBtn.style.visibility = 'hidden';
    elements.checkoutNextBtn.innerHTML = `Continue to Payment <i data-lucide="arrow-right"></i>`;
  } else if (checkoutStep === 2) {
    elements.checkoutBackBtn.style.visibility = 'visible';
    elements.checkoutNextBtn.innerHTML = `Place Secure Order <i data-lucide="lock"></i>`;
    populateCheckoutSummary();
    setupPaymentTabSwitching();
  } else if (checkoutStep === 3) {
    elements.checkoutNavBtns.style.display = 'none';
    const orderId = generateOrderAndSave();
    elements.successOrderId.textContent = orderId;
    triggerOrderSuccessConfetti();
    
    // Clear cart state
    cart = [];
    appliedCoupon = null;
    elements.couponInput.value = '';
    elements.couponMsg.style.display = 'none';
    saveCartToStorage();
    updateCartUI();
  }

  lucide.createIcons();
}

function populateCheckoutSummary() {
  elements.checkoutOrderBreakdown.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const total = item.product.price * item.quantity;
    subtotal += total;

    const row = document.createElement('div');
    row.className = 'checkout-summary-item';
    row.innerHTML = `
      <span>${item.product.title} x ${item.quantity}</span>
      <span>₹${total}</span>
    `;
    elements.checkoutOrderBreakdown.appendChild(row);
  });

  let discount = 0;
  if (appliedCoupon === 'BIHAR10') discount = subtotal * 0.1;
  else if (appliedCoupon === 'PUJA20') discount = subtotal * 0.2;

  const shipping = subtotal >= 500 ? 0 : 50;
  const grandTotal = subtotal - discount + shipping;

  if (discount > 0) {
    const dRow = document.createElement('div');
    dRow.className = 'checkout-summary-item';
    dRow.innerHTML = `
      <span>Coupon Discount</span>
      <span style="color: var(--color-success)">-₹${discount.toFixed(2)}</span>
    `;
    elements.checkoutOrderBreakdown.appendChild(dRow);
  }

  const sRow = document.createElement('div');
  sRow.className = 'checkout-summary-item';
  sRow.innerHTML = `
    <span>Delivery Fee</span>
    <span>${shipping === 0 ? 'FREE' : '₹' + shipping.toFixed(2)}</span>
  `;
  elements.checkoutOrderBreakdown.appendChild(sRow);

  elements.checkoutTotalToPay.textContent = `₹${grandTotal.toFixed(2)}`;
  
  // Set total dynamic amount inside UPI instructions
  const upiAmtText = document.getElementById('upi-amount-span');
  if (upiAmtText) {
    upiAmtText.textContent = grandTotal.toFixed(2);
  }
}

// Payment method toggles & validations
function setupPaymentTabSwitching() {
  const radios = document.querySelectorAll('input[name="payment-method"]');
  const detailsPanes = document.querySelectorAll('.payment-details-pane');

  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      detailsPanes.forEach(pane => pane.classList.remove('active'));
      const activeMethod = e.target.value;
      const targetPane = document.getElementById(`pay-details-${activeMethod}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Initialize card masking inputs
  const cardNumInput = document.getElementById('card-number');
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      // Keep only numbers and add spaces every 4 digits
      let val = e.target.value.replace(/\D/g, '');
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted.substring(0, 19);
    });
  }

  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        e.target.value = val.substring(0,2) + '/' + val.substring(2,4);
      } else {
        e.target.value = val;
      }
    });
  }
}

function handleCheckoutNext() {
  if (checkoutStep === 1) {
    // Validate inputs
    const name = document.getElementById('shipping-name').value.trim();
    const phone = document.getElementById('shipping-phone').value.trim();
    const pincode = document.getElementById('shipping-pincode').value.trim();
    const address = document.getElementById('shipping-address').value.trim();

    if (!name || !phone || !pincode || !address) {
      alert('Please fill out all shipping details before proceeding.');
      return;
    }
    
    // Check pincode length
    if (pincode.length < 6 || isNaN(pincode)) {
      alert('Please enter a valid 6-digit Pincode.');
      return;
    }

    checkoutStep = 2;
    updateCheckoutStepUI();
  } else if (checkoutStep === 2) {
    // Validate payment inputs based on selection
    const method = document.querySelector('input[name="payment-method"]:checked').value;

    if (method === 'card') {
      const cardNum = document.getElementById('card-number').value.replace(/\s/g, '');
      const expiry = document.getElementById('card-expiry').value;
      const cvv = document.getElementById('card-cvv').value;

      if (cardNum.length !== 16 || isNaN(cardNum)) {
        alert('Please enter a valid 16-digit Card Number.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Please enter expiry in MM/YY format.');
        return;
      }
      if (cvv.length !== 3 || isNaN(cvv)) {
        alert('Please enter a valid 3-digit CVV.');
        return;
      }
    }

    // Simulate Payment Gateway processing overlay
    const nextBtn = elements.checkoutNextBtn;
    nextBtn.disabled = true;
    nextBtn.innerHTML = `<span class="payment-spinner"></span> Processing Secure Payment...`;

    setTimeout(() => {
      nextBtn.disabled = false;
      checkoutStep = 3;
      updateCheckoutStepUI();
    }, 2200); // 2.2 second simulated bank loading screen
  }
}

function handleCheckoutBack() {
  if (checkoutStep > 1) {
    checkoutStep--;
    updateCheckoutStepUI();
  }
}

// Writes placed order object directly to LocalStorage array
function generateOrderAndSave() {
  const orders = JSON.parse(localStorage.getItem('kk_orders')) || [];
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `KK-${randNum}-2026`;

  const name = document.getElementById('shipping-name').value.trim();
  const phone = document.getElementById('shipping-phone').value.trim();
  const pincode = document.getElementById('shipping-pincode').value.trim();
  const address = document.getElementById('shipping-address').value.trim();
  const method = document.querySelector('input[name="payment-method"]:checked').value;

  // Calculate pricing
  let subtotal = 0;
  const itemsBreakdown = cart.map(item => {
    subtotal += item.product.price * item.quantity;
    return {
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    };
  });

  let discount = 0;
  if (appliedCoupon === 'BIHAR10') discount = subtotal * 0.1;
  else if (appliedCoupon === 'PUJA20') discount = subtotal * 0.2;

  const shipping = getDeliveryCost(subtotal);
  const grandTotal = subtotal - discount + shipping;

  const newOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    deliveryTier: selectedDeliveryTier,
    customer: {
      name,
      phone,
      pincode,
      address
    },
    items: itemsBreakdown,
    pricing: {
      subtotal,
      discount,
      shipping,
      total: grandTotal
    },
    paymentMethod: method.toUpperCase(),
    status: 'Dispatched'
  };

  orders.unshift(newOrder); // Add to beginning of database
  localStorage.setItem('kk_orders', JSON.stringify(orders));
  
  return orderId;
}

// Confetti success drops
function triggerOrderSuccessConfetti() {
  const colors = ['#2E5A44', '#D47A3B', '#D4AF37', '#FAF0E6', '#BD6427'];
  const confettiCount = 80;

  for (let i = 0; i < confettiCount; i++) {
    const conf = document.createElement('div');
    conf.className = 'confetti';
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = Math.random() * 100 + 'vw';
    conf.style.top = -10 + 'px';
    conf.style.width = Math.random() * 8 + 6 + 'px';
    conf.style.height = conf.style.width;
    conf.style.animationDuration = Math.random() * 2 + 1.5 + 's';
    conf.style.animationDelay = Math.random() * 0.4 + 's';
    
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 3500);
  }
}

// --- REGIONAL LANGUAGE DICTIONARY ---
const TRANSLATIONS = {
  en: {
    nav_home: 'Home',
    nav_shop: 'Shop Bounty',
    nav_calendar: 'Seasonal Cycles',
    nav_heritage: 'Our Heritage',
    nav_artisans: 'Farmers & Artisans',
    nav_contact: 'Contact Us',
    nav_track: 'Track Order',
    artisans_heading: 'Meet Our Farmers & Artisans',
    artisans_sub: 'Every harvest and handicraft supports local families directly. 85%+ of your payment goes straight to regional producer accounts.'
  },
  hi: {
    nav_home: 'मुख्य पृष्ठ',
    nav_shop: 'उत्पाद खरीदें',
    nav_calendar: 'ऋतु चक्र',
    nav_heritage: 'हमारी धरोहर',
    nav_artisans: 'किसान एवं कारीगर',
    nav_contact: 'संपर्क करें',
    nav_track: 'ऑर्डर ट्रैक करें',
    artisans_heading: 'हमारे किसान एवं हस्तशिल्पी',
    artisans_sub: 'प्रत्येक फसल और हस्तशिल्प सीधे स्थानीय परिवारों को सशक्त बनाता है। आपकी राशि का 85%+ भाग सीधे किसानों के खाते में जाता है।'
  },
  mai: {
    nav_home: 'मुख्य पृष्ठ',
    nav_shop: 'सामान खरिदौ',
    nav_calendar: 'ऋतु चक्र',
    nav_heritage: 'हमर धरोहर',
    nav_artisans: 'किसान आ कारीगर',
    nav_contact: 'संपर्क करू',
    nav_track: 'ऑर्डर ट्रैक करू',
    artisans_heading: 'हमर मिथिलाक किसान आ कारीगर',
    artisans_sub: 'प्रत्येक मखाना आ हस्तशिल्प सँ स्थानीय परिवार केँ नीक आमदनी होइछ। 85%+ राशि सीधे किसानक खाता में जाइछ।'
  },
  bho: {
    nav_home: 'मुख्य पेज',
    nav_shop: 'सामान खरीदीं',
    nav_calendar: 'ऋतु चक्र',
    nav_heritage: 'राउर धरोहर',
    nav_artisans: 'किसान आ कारीगर',
    nav_contact: 'संपर्क करीं',
    nav_track: 'ऑर्डर खोजीं',
    artisans_heading: 'हमनी के किसान आ कारीगर',
    artisans_sub: 'हर फसल आ हस्तशिल्प से सीधे गाँव-घर के मदद मिलेला। 85%+ पइसा सीधे किसान लोगन के खाता में जाला।'
  }
};

let currentLanguage = 'en';
let selectedDeliveryTier = 'standard';

function changeLanguage(langKey) {
  if (!TRANSLATIONS[langKey]) return;
  currentLanguage = langKey;
  const dict = TRANSLATIONS[langKey];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  showToast(`Language changed to ${langKey.toUpperCase()}`);
}

function selectDeliveryTier(tierKey) {
  selectedDeliveryTier = tierKey;
  
  document.querySelectorAll('.delivery-tier-card').forEach(card => {
    card.classList.remove('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = false;
  });

  const activeCard = document.getElementById(`tier-card-${tierKey}`);
  if (activeCard) {
    activeCard.classList.add('selected');
    const radio = activeCard.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  updateCartUI();
}

function getDeliveryCost(subtotal) {
  if (selectedDeliveryTier === 'express') return 90;
  if (selectedDeliveryTier === 'festival') return 150;
  // Standard
  return subtotal >= 499 ? 0 : 40;
}

// --- ORDER TRACKING ENGINE ---
function openTrackingModal(prefillOrderId) {
  const modal = document.getElementById('tracking-modal');
  const input = document.getElementById('tracking-id-input');
  if (prefillOrderId && input) {
    input.value = prefillOrderId;
    executeOrderTracking(prefillOrderId);
  } else if (input && !input.value) {
    input.value = 'KK-8924-9102';
    executeOrderTracking('KK-8924-9102');
  }
  if (modal) modal.classList.add('open');
}

function executeOrderTracking(searchId) {
  searchId = searchId || document.getElementById('tracking-id-input').value.trim();
  if (!searchId) {
    showToast('Please enter a valid Order ID');
    return;
  }

  const orders = JSON.parse(localStorage.getItem('kk_orders') || '[]');
  const foundOrder = orders.find(o => o.id.toUpperCase() === searchId.toUpperCase());

  const metaId = document.getElementById('track-meta-id');
  const metaStatus = document.getElementById('track-meta-status');
  const metaDate = document.getElementById('track-meta-date');
  const partnerName = document.getElementById('track-partner-name');
  const partnerDetails = document.getElementById('track-partner-details');
  const progressLine = document.getElementById('track-progress-line');

  if (foundOrder) {
    metaId.textContent = `Order #${foundOrder.id}`;
    metaStatus.textContent = foundOrder.status || 'Confirmed';
    metaDate.textContent = `Date: ${foundOrder.date || 'Recent'}`;
    
    partnerName.textContent = foundOrder.deliveryTier === 'express' 
      ? 'Bihar Krishi Cold-Express (24h Delivery)'
      : (foundOrder.deliveryTier === 'festival' ? 'Festival Freight Eco-Bamboocrate' : 'India Post Rural & Intra-State Express');
    
    partnerDetails.innerHTML = `Customer: <strong>${foundOrder.customer.name}</strong> (${foundOrder.customer.pincode}). Total Paid: <strong>₹${foundOrder.pricing.total.toFixed(2)}</strong> via ${foundOrder.paymentMethod}.`;

    if (foundOrder.status === 'Delivered') {
      progressLine.style.width = '100%';
    } else if (foundOrder.status === 'Dispatched' || foundOrder.status === 'In Transit') {
      progressLine.style.width = '66%';
    } else {
      progressLine.style.width = '33%';
    }
  } else {
    // Simulated demo status for custom IDs
    metaId.textContent = `Order #${searchId.toUpperCase()}`;
    metaStatus.textContent = 'In Transit (Dispatched)';
    metaDate.textContent = 'Est. Delivery: 1-2 Days';
    partnerName.textContent = 'Bihar Krishi Express & India Post Rural';
    partnerDetails.innerHTML = `Live Hub: Patna Central Facility ➔ Regional Outpost. Packaging verified <strong>100% Biodegradable Jute</strong>.`;
    progressLine.style.width = '66%';
  }

  showToast(`Order details updated for ${searchId}`);
}

// --- EVENT LISTENERS REGISTRATION ---
function setupEventListeners() {
  // Navigation scrolled state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      elements.header.classList.add('scrolled');
    } else {
      elements.header.classList.remove('scrolled');
    }
  });

  // Language Switcher
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => changeLanguage(e.target.value));
  }

  // Tracking Modal triggers
  const openTrackBtn = document.getElementById('open-tracking-modal-btn');
  const closeTrackBtn = document.getElementById('close-tracking-modal-btn');
  const trackModal = document.getElementById('tracking-modal');
  const trackSubmitBtn = document.getElementById('track-order-submit-btn');

  if (openTrackBtn) openTrackBtn.addEventListener('click', () => openTrackingModal());
  if (closeTrackBtn) closeTrackBtn.addEventListener('click', () => trackModal.classList.remove('open'));
  if (trackModal) {
    trackModal.addEventListener('click', (e) => {
      if (e.target === trackModal) trackModal.classList.remove('open');
    });
  }
  if (trackSubmitBtn) {
    trackSubmitBtn.addEventListener('click', () => {
      const val = document.getElementById('tracking-id-input').value;
      executeOrderTracking(val);
    });
  }

  // Live searching triggers
  elements.catalogSearch.addEventListener('input', handleFilterSearch);
  elements.catalogSort.addEventListener('change', handleFilterSearch);

  // Category selection tabs
  elements.categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      elements.categoryBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      handleFilterSearch();
    });
  });

  // Cart drawer triggers
  elements.cartDrawerBtn.addEventListener('click', openCartDrawer);
  elements.closeCartBtn.addEventListener('click', closeCartDrawer);
  elements.cartOverlay.addEventListener('click', (e) => {
    if (e.target === elements.cartOverlay) closeCartDrawer();
  });

  // Category select from circular icons or promo banners
  window.handleCategoryFilterSelect = function(catKey) {
    const btnToClick = document.querySelector(`.category-btn[data-category="${catKey}"]`) || document.querySelector('.category-btn[data-category="all"]');
    if (btnToClick) {
      elements.categoryBtns.forEach(btn => btn.classList.remove('active'));
      btnToClick.classList.add('active');
      handleFilterSearch();
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Modal triggers
  elements.closeProductModalBtn.addEventListener('click', () => elements.productModal.classList.remove('open'));
  elements.productModal.addEventListener('click', (e) => {
    if (e.target === elements.productModal) elements.productModal.classList.remove('open');
  });

  elements.closeStoryModalBtn.addEventListener('click', () => elements.storyModal.classList.remove('open'));
  elements.storyModal.addEventListener('click', (e) => {
    if (e.target === elements.storyModal) elements.storyModal.classList.remove('open');
  });

  elements.closeCheckoutModalBtn.addEventListener('click', () => elements.checkoutModal.classList.remove('open'));
  
  // Checkout actions
  elements.checkoutTriggerBtn.addEventListener('click', openCheckoutWizard);
  elements.checkoutNextBtn.addEventListener('click', handleCheckoutNext);
  elements.checkoutBackBtn.addEventListener('click', handleCheckoutBack);

  // Coupon code submit
  elements.applyCouponBtn.addEventListener('click', handleApplyCoupon);
  elements.couponInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyCoupon();
    }
  });

  // Header quick search focus
  document.getElementById('search-trigger-btn').addEventListener('click', () => {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => elements.catalogSearch.focus(), 800);
  });

  // Heritage stories learn more trigger
  document.querySelectorAll('.btn-learn-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const storyId = e.currentTarget.getAttribute('data-story');
      openStoryModal(storyId);
    });
  });

  // Seasonal calendar tabs
  elements.seasonTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      elements.seasonTabBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const targetSeason = e.currentTarget.getAttribute('data-season');
      elements.seasonContentPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `season-${targetSeason}`) {
          pane.classList.add('active');
        }
      });
    });
  });

  // Navigation click focus active tabs
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      e.currentTarget.classList.add('active');
    });
  });
}

// --- Scroll Reveal Animations ---
const revealSections = document.querySelectorAll('.reveal-on-scroll');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealSections.forEach(section => sectionObserver.observe(section));

// --- Dead Link Handler ---
document.querySelectorAll('[data-coming-soon]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const msg = this.getAttribute('data-coming-soon') || 'This page is coming soon!';
    showToast(msg);
  });
});

