/*
========================================================================
   W-BIZ DRY FRUITS & NUTS STORE - DYNAMIC CMS DATA SYSTEM
   Features local offline fallback data & real-time Google Sheets CMS
========================================================================
*/

// 1. Google Sheets CSV URLs Configuration
// Create a Google Sheet, add sheets/tabs (Products, Offers, Reviews, FAQs, Gallery), 
// publish each sheet as a CSV file from "File -> Share -> Publish to Web", and paste the links here.
const GOOGLE_SHEETS = {
  // You can replace these placeholder/sample links with your actual published CSV URLs
  PRODUCTS: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT17dE0k0vR50l_jG34z7TkiNqR94iZ-4o7R20c5_hJ9Yp_D1407P4Q7u2s/pub?output=csv",
  OFFERS: "",
  REVIEWS: "",
  FAQS: "",
  GALLERY: ""
};

// 2. High-Performance Premium Offline Fallback Database
// This ensures your website loads instantly and never breaks even if Google Sheets is down or slow.

// 2a. Products Fallback Catalog
const defaultProducts = [
  {
    id: "almonds",
    name: "California Almonds",
    category: "almonds",
    badge: "Premium",
    image: "assets/products/almonds.png",
    description: "Giant, crispy California almonds rich in essential brain-health vitamin E, dietary fibers, and natural organic oils.",
    price_250g: 280,
    price_500g: 540,
    price_1kg: 1050,
    is_featured: true,
    out_of_stock: false
  },
  {
    id: "cashews",
    name: "Jumbo Roasted Cashews",
    category: "cashews",
    badge: "Jumbo",
    image: "assets/products/cashews.png",
    description: "Flawless, buttery W240 cashew nuts golden roasted to locked-in crunchiness, rich in proteins and magnesium.",
    price_250g: 320,
    price_500g: 620,
    price_1kg: 1200,
    is_featured: true,
    out_of_stock: false
  },
  {
    id: "pistachios",
    name: "Roasted Salted Pistachios",
    category: "pistachios",
    badge: "Salted",
    image: "assets/products/pistachios.png",
    description: "Premium cracked-shell pistachios with vibrant green kernels, roasted and lightly salted for an incredible energy snack.",
    price_250g: 350,
    price_500g: 680,
    price_1kg: 1300,
    is_featured: false,
    out_of_stock: false
  },
  {
    id: "walnuts",
    name: "Chilean Walnuts",
    category: "walnuts",
    badge: "Chilean",
    image: "assets/products/walnuts.png",
    description: "Premium vacuum-packed light halves walnuts. High in plant-based Omega-3 fatty acids for heart and cognitive strength.",
    price_250g: 380,
    price_500g: 740,
    price_1kg: 1450,
    is_featured: false,
    out_of_stock: false
  },
  {
    id: "raisins",
    name: "Golden & Black Raisins",
    category: "raisins",
    badge: "Organic",
    image: "assets/products/raisins.png",
    description: "Juicy, premium sun-dried kishmish grapes, packed with rich dietary iron, antioxidants, and pure sweet flavor.",
    price_250g: 180,
    price_500g: 340,
    price_1kg: 650,
    is_featured: false,
    out_of_stock: false
  },
  {
    id: "dates",
    name: "Royal Medjool Dates",
    category: "dates",
    badge: "Medjool",
    image: "assets/products/dates.png",
    description: "Luscious, king-sized organic dates directly imported from international groves. High natural energy source.",
    price_250g: 450,
    price_500g: 880,
    price_1kg: 1700,
    is_featured: true,
    out_of_stock: false
  },
  {
    id: "figs",
    name: "Turkish Dried Figs",
    category: "figs",
    badge: "Turkish",
    image: "assets/products/figs.png",
    description: "Fleshy, soft Turkish anjeer sun-dried with traditional methods. Rich in natural dietary fiber and calcium.",
    price_250g: 420,
    price_500g: 820,
    price_1kg: 1600,
    is_featured: false,
    out_of_stock: false
  },
  {
    id: "mixed",
    name: "Gourmet Nut & Berry Mix",
    category: "mixed",
    badge: "Health Mix",
    image: "assets/products/mixed.png",
    description: "A premium energetic assortment featuring whole almonds, raw cashews, sweet raisins, and organic seed blends.",
    price_250g: 400,
    price_500g: 780,
    price_1kg: 1500,
    is_featured: false,
    out_of_stock: false
  },
  {
    id: "gift-boxes",
    name: "Luxury Utsav Box",
    category: "gift-boxes",
    badge: "Gift Pack",
    image: "assets/store-packaging.png",
    description: "Stunning handcrafted wooden box, velvet lined, containing divided grids of premium almonds, walnuts, and cashews.",
    price_250g: 1999,
    price_500g: null,
    price_1kg: null,
    is_featured: true,
    out_of_stock: false
  }
];

// 2b. Daily Offers Fallback
const defaultOffers = [
  {
    id: "combo-1",
    title: "The Royal Dry Fruit Platter",
    badge: "Best Seller",
    description: "A premium combination containing hand-selected California Almonds (250g), Roasted Cashews (250g), and Salted Pistachios (250g). Perfect for high-energy snacks.",
    price: 1249,
    original_price: 1500,
    whatsapp_text: "Hi W-Biz Dry Fruits, I want to order the Royal Dry Fruit Platter Offer."
  },
  {
    id: "combo-2",
    title: "Immunity & Energy Booster Pack",
    badge: "15% Off",
    description: "A powerful organic dry fruits wellness set featuring Whole Walnuts (250g), Premium Raisins (250g), and Plump Turkish Figs (250g) to strengthen daily health.",
    price: 1450,
    original_price: 1700,
    whatsapp_text: "Hi W-Biz Dry Fruits, I want to order the Immunity & Energy Booster Pack."
  },
  {
    id: "combo-3",
    title: "Premium Utsav Gift Box",
    badge: "Festive Special",
    description: "A beautifully crafted luxury wooden gift box packed with premium almonds, walnuts, dates, and mixed nuts. Customizable branding option for corporate gifting.",
    price: 1999,
    original_price: 2400,
    whatsapp_text: "Hi W-Biz Dry Fruits, I'm interested in the Premium Utsav Gift Box."
  }
];

// 2c. Reviews Fallback
const defaultReviews = [
  {
    id: "review-1",
    name: "Anand Kulkarni",
    role: "IT Director, Wakad, Pune",
    rating: 5,
    comment: "W-Biz is by far the finest dry fruits store near the Mumbai Pune Expressway. The jumbo cashews are wonderfully sweet and crispy, and their customer packaging feels extremely luxurious. Perfect for corporate gifting!"
  },
  {
    id: "review-2",
    name: "Priya Deshmukh",
    role: "Fitness Blogger, Pimpri-Chinchwad",
    rating: 5,
    comment: "We bought their customizable festive dry fruits gift boxes for Diwali, and all our relatives were amazed by the rich size and quality of the pistachios and figs. Sourcing is absolutely authentic."
  },
  {
    id: "review-3",
    name: "Dr. Rakesh Mehta",
    role: "Cardiologist, Wakad",
    rating: 4.5,
    comment: "Superb hygienic environment inside the store. I regularly buy their organic figs and California almonds. It's clean, premium, and very friendly. Sourcing genuine organic dry fruits in Pune has become incredibly easy!"
  }
];

// 2d. FAQ Fallback
const defaultFAQs = [
  {
    id: "faq-1",
    question: "Where is W-Biz Dry Fruits store located?",
    answer: "Our premium boutique store is located at Shop No 13, W-Biz Society, Survey No.123/1/1, Mumbai - Pune Expressway, Wakad, Pune, Maharashtra 411033. It is highly accessible for residents of Wakad, Pimpri-Chinchwad, and travellers on the Expressway."
  },
  {
    id: "faq-2",
    question: "Do you offer home delivery in Wakad and Pune?",
    answer: "Yes! We provide express, contactless doorstep delivery across Wakad, Pimpri-Chinchwad, and selective sectors of Pune. Contact us via WhatsApp to share your address and secure immediate shipping options."
  },
  {
    id: "faq-3",
    question: "Can we customize corporate and festive gift boxes?",
    answer: "Absolutely! We specialize in premium personalized dry fruits gift boxes. You can choose the tray material (wooden, gold hard-board, eco-sleeves), custom choose the assortment dry fruits (almonds, cashews, pistachios, dates, figs, mixed), and engrave your corporate emblem on the outer packaging."
  },
  {
    id: "faq-4",
    question: "What makes W-Biz dry fruits organic and unique?",
    answer: "We focus strictly on premium grades (like California almonds and King-size Cashews). Our items are sorted and vacuum-packed under certified clean facilities without artificial polish, chemical colors, or preservatives, assuring 100% natural oil preservation and crispness."
  }
];

// 2e. Gallery Fallback
const defaultGallery = [
  {
    id: "photo-1",
    category: "interior",
    image: "assets/store-interior.png",
    caption: "Luxury flagship boutique in Wakad, Pune featuring premium wood shelving and clean warm lighting.",
    title: "Luxury Boutique",
    subtitle: "Store Interior"
  },
  {
    id: "photo-2",
    category: "packaging",
    image: "assets/store-packaging.png",
    caption: "Luxury festive wooden gift box packed with raw walnuts, cashews, and almonds finished with gold ribbons.",
    title: "Utsav Gift Box",
    subtitle: "Festive Packaging"
  },
  {
    id: "photo-3",
    category: "products",
    image: "assets/products/almonds.png",
    caption: "Sun-dried jumbo California almonds in a rustic presentation bowl.",
    title: "California Almonds",
    subtitle: "Gourmet Products"
  },
  {
    id: "photo-4",
    category: "products",
    image: "assets/products/cashews.png",
    caption: "Jumbo size cashew nuts roasted to perfection in a designer metallic dish.",
    title: "Jumbo Cashews",
    subtitle: "Gourmet Products"
  },
  {
    id: "photo-5",
    category: "products",
    image: "assets/products/pistachios.png",
    caption: "Crunchy green salted pistachios sorted meticulously for absolute sizing purity.",
    title: "Salted Pistachios",
    subtitle: "Gourmet Products"
  },
  {
    id: "photo-6",
    category: "products",
    image: "assets/products/figs.png",
    caption: "Succulent sweet Turkish dried figs stacked elegantly on dark slate.",
    title: "Turkish Figs",
    subtitle: "Gourmet Products"
  },
  {
    id: "photo-7",
    category: "products",
    image: "assets/products/dates.png",
    caption: "Luscious, sweet imported Medjool dates full of dietary iron and vitamin boosts.",
    title: "Medjool Dates",
    subtitle: "Gourmet Products"
  },
  {
    id: "photo-8",
    category: "products",
    image: "assets/about-img.png",
    caption: "Gourmet raw walnuts and dried fruits sorted on a smooth marble tray.",
    title: "Raw Assortments",
    subtitle: "Gourmet Products"
  },
  {
    id: "photo-9",
    category: "products",
    image: "assets/hero-bg.png",
    caption: "Complete luxury dry fruit and nut platter showcase under warm studio lights.",
    title: "Luxury Gourmet Platter",
    subtitle: "Gourmet Products"
  }
];

// 3. Robust client-side CSV Parser
function parseCSVToJSON(csvText) {
  const lines = [];
  let currentLine = [];
  let inQuotes = false;
  let currentValue = "";

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentValue.trim());
      currentValue = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip next \n
      }
      currentLine.push(currentValue.trim());
      lines.push(currentLine);
      currentLine = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  
  if (currentValue || currentLine.length > 0) {
    currentLine.push(currentValue.trim());
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map(h => h.toLowerCase().trim());
  const jsonResult = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i];
    if (values.length < headers.length) continue; // Skip malformed rows
    
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = values[j];
      
      // Auto-convert numbers and booleans
      if (val === "TRUE" || val === "true") val = true;
      else if (val === "FALSE" || val === "false") val = false;
      else if (val === "" || val === "null" || val === "NaN") val = null;
      else if (!isNaN(val) && val !== "") val = Number(val);
      
      obj[headers[j]] = val;
    }
    jsonResult.push(obj);
  }

  return jsonResult;
}

// 4. Centralised Dynamic Content Fetching with Timeouts
async function fetchSheetData(url, fallbackData, label) {
  if (!url || url.includes("YOUR_SHEET_ID") || !url.startsWith("http")) {
    console.log(`Using high-performance local offline database for [${label}].`);
    return fallbackData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast loads

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Google Sheet network response failed for ${label}`);
    const csvText = await response.text();
    const parsedData = parseCSVToJSON(csvText);
    
    if (parsedData.length > 0) {
      console.log(`Successfully synced [${label}] real-time data from Google Sheets!`, parsedData);
      return parsedData;
    }
    
    throw new Error("Parsed sheet data was empty.");
  } catch (error) {
    console.warn(`Fallback triggered for [${label}]:`, error.message);
    return fallbackData;
  }
}

// Expose simplified interfaces
async function loadProductsData() {
  return fetchSheetData(GOOGLE_SHEETS.PRODUCTS, defaultProducts, "Products");
}

async function loadOffersData() {
  return fetchSheetData(GOOGLE_SHEETS.OFFERS, defaultOffers, "Daily Offers");
}

async function loadReviewsData() {
  return fetchSheetData(GOOGLE_SHEETS.REVIEWS, defaultReviews, "Reviews");
}

async function loadFAQData() {
  return fetchSheetData(GOOGLE_SHEETS.FAQS, defaultFAQs, "FAQs");
}

async function loadGalleryData() {
  return fetchSheetData(GOOGLE_SHEETS.GALLERY, defaultGallery, "Gallery");
}
