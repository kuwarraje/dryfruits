/*
========================================================================
   W-BIZ DRY FRUITS & NUTS STORE - DYNAMIC PRODUCTS DATA SYSTEM
   Features local offline fallback data & real-time Google Sheets CMS
========================================================================
*/

// 1. Paste your Published Google Sheet CSV URL here!
// To set it up: Create a Google Sheet, add columns, Publish to Web as CSV, and paste link here.
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT17dE0k0vR50l_jG34z7TkiNqR94iZ-4o7R20c5_hJ9Yp_D1407P4Q7u2s/pub?output=csv"; // Placeholder or User's Google sheet URL

// 2. Premium offline fallback data so the site loads instantly and never breaks
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
    price_250g: 1999, // Acts as the flat/box price
    price_500g: null,
    price_1kg: null,
    is_featured: true,
    out_of_stock: false
  }
];

// 3. Simple robust CSV Parser
function parseCSVToJSON(csvText) {
  const lines = [];
  let currentLine = [];
  let inQuotes = false;
  let currentValue = "";

  // Parse CSV handles comma inside quotes elegantly!
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

// 4. Load Products dynamically
async function loadProductsData() {
  // If the user has not replaced the placeholder URL or it is local development, we fallback to default
  if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes("YOUR_SHEET_ID")) {
    console.log("Using high-performance local fallback dryfruits database.");
    return defaultProducts;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast response

    const response = await fetch(GOOGLE_SHEET_CSV_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Google Sheet network response failed.");
    const csvText = await response.text();
    const parsedData = parseCSVToJSON(csvText);
    
    if (parsedData.length > 0) {
      console.log("Successfully fetched real-time product list from Google Sheets!", parsedData);
      return parsedData;
    }
    
    throw new Error("Parsed sheet data was empty.");
  } catch (error) {
    console.warn("Failed to load Google Sheet data. Falling back to offline-first local product list:", error.message);
    return defaultProducts;
  }
}
