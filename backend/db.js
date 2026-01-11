import sqlite3 from 'sqlite3';

import fs from 'fs';
import path from 'path';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'terrario.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database at ' + dbPath);
    initDb();
  }
});

const BUSINESSES_DATA = [
  {
    name: "TROPIWINGS",
    category: "Restaurantes",
    specialty: "ALITAS & COSTILLAS",
    deliveryTime: "30 min",
    image: "",
    logo: "",
    hours: "5:00 PM - 11:00 PM",
    opening_time: "17:00",
    closing_time: "23:00",
    status: "closed", // Initial state, will be calc by server
    distances: JSON.stringify({ walk: "1 min", car: "1 min", bike: "1 min" }),
    keywords: JSON.stringify(["Alitas", "Costillas"]),
    description: "",
    gallery: JSON.stringify([]),
    whatsapp: "3232851699",
    latitude: "",
    longitude: ""
  },
  {
    name: "LOS CHAMOS",
    category: "Restaurantes",
    specialty: "COMIDAS RAPIDAS/Shawarma",
    deliveryTime: "30 min",
    image: "",
    logo: "",
    hours: "5:30 PM - 11:00 PM",
    opening_time: "17:30",
    closing_time: "23:00",
    status: "closed",
    distances: JSON.stringify({ walk: "1 min", car: "1 min", bike: "1 min" }),
    keywords: JSON.stringify(["Comidas Rápidas", "Shawarma"]),
    description: "",
    gallery: JSON.stringify([]),
    whatsapp: "3148092595",
    latitude: "",
    longitude: ""
  },
  {
    name: "PERROS Y PERRAS",
    category: "Restaurantes",
    specialty: "COMIDAS RAPIDAS",
    deliveryTime: "15-20 min",
    image: "",
    logo: "",
    hours: "6:00 PM - 12:00 AM",
    opening_time: "18:00",
    closing_time: "00:00",
    status: "closed",
    distances: JSON.stringify({ walk: "1 min", car: "1 min", bike: "1 min" }),
    keywords: JSON.stringify(["Perros Calientes", "Comidas Rápidas"]),
    description: "",
    gallery: JSON.stringify([]),
    whatsapp: "3106818108",
    latitude: "4.521611",
    longitude: "-75.689028"
  },
  {
    name: "LA ARROCERIA",
    category: "Restaurantes",
    specialty: "ARROZ",
    deliveryTime: "50 min",
    image: "",
    logo: "",
    hours: "10:00 AM - 8:30 PM",
    opening_time: "10:00",
    closing_time: "20:30",
    status: "closed",
    distances: JSON.stringify({ walk: "1 min", car: "1 min", bike: "1 min" }),
    keywords: JSON.stringify(["Arroz", "Almuerzos"]),
    description: "",
    gallery: JSON.stringify([]),
    whatsapp: "3105063420",
    latitude: "4.521833",
    longitude: "-75.689417"
  },
  {
    name: "BROASTER DEL CHEF",
    category: "Restaurantes",
    specialty: "POLLO BROASTER Y ALMUERZOS",
    deliveryTime: "20 min",
    image: "",
    logo: "",
    hours: "11:00 AM - 9:00 PM",
    opening_time: "11:00",
    closing_time: "21:00",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Pollo", "Broaster", "Almuerzos"]),
    description: "",
    gallery: JSON.stringify([]),
    whatsapp: "3177551212",
    latitude: "4.521889",
    longitude: "-75.689667"
  },
  {
    name: "DROGUERÍA LAS ACASIAS",
    category: "Droguerías",
    specialty: "DROGUERÍA",
    deliveryTime: "20 min",
    image: "",
    logo: "",
    hours: "7:00 AM - 9:30 PM",
    opening_time: "07:00",
    closing_time: "21:30",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "1 min", bike: "1 min" }),
    keywords: JSON.stringify(["Medicamentos", "Farmacia"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3000000000", // Placeholder as it was incomplete
    latitude: "4.521806",
    longitude: "-75.689583"
  },
  {
    name: "CARNITAS",
    category: "Restaurantes",
    specialty: "ASADOS AL BARRIL",
    deliveryTime: "20 min",
    image: "",
    logo: "",
    hours: "4:00 PM - 12:00 AM",
    opening_time: "16:00",
    closing_time: "00:00",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Carnes", "Asados", "Barril"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3143511870",
    latitude: "4.521806",
    longitude: "-75.689389"
  },
  {
    name: "TROPICAL FRUITS",
    category: "Restaurantes", // Or Cafés/Heladerías if available, using Restaurantes for consistency
    specialty: "HELADERÍA",
    deliveryTime: "45 min",
    image: "",
    logo: "",
    hours: "1:00 PM - 10:00 PM",
    opening_time: "13:00",
    closing_time: "22:00",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Helados", "Frutas", "Postres"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3213113737",
    latitude: "4.522139",
    longitude: "-75.689889"
  },
  {
    name: "POLLO SABROSON",
    category: "Restaurantes",
    specialty: "POLLO",
    deliveryTime: "20-30 min",
    image: "",
    logo: "",
    hours: "11:00 AM - 8:45 PM",
    opening_time: "11:00",
    closing_time: "20:45",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Pollo", "Asado"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3103131115",
    latitude: "4.522111",
    longitude: "-75.690111"
  },
  {
    name: "CRIOLLITAS",
    category: "Restaurantes",
    specialty: "AREPAS RELLENAS",
    deliveryTime: "15 min",
    image: "",
    logo: "",
    hours: "5:00 PM - 10:30 PM",
    opening_time: "17:00",
    closing_time: "22:30",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Arepas", "Rellenas"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3212127100",
    latitude: "4.522194",
    longitude: "-75.690389"
  },
  {
    name: "BLOM",
    category: "Restaurantes",
    specialty: "CREPES Y WAFLES",
    deliveryTime: "20 min",
    image: "",
    logo: "",
    hours: "5:00 PM - 10:00 PM",
    opening_time: "17:00",
    closing_time: "22:00",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Crepes", "Waffles", "Postres"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3153538282",
    latitude: "4.522194",
    longitude: "-75.690389"
  },
  {
    name: "WANDER BURGUER",
    category: "Restaurantes",
    specialty: "COMIDAS RAPIDAS",
    deliveryTime: "45-50 min",
    image: "",
    logo: "",
    hours: "3:00 PM - 11:00 PM",
    opening_time: "15:00",
    closing_time: "23:00",
    status: "closed",
    distances: JSON.stringify({ walk: "2 min", car: "2 min", bike: "2 min" }),
    keywords: JSON.stringify(["Hamburguesas", "Comidas Rápidas"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "",
    latitude: "",
    longitude: ""
  },
  {
    name: "BURGUER MERAKI",
    category: "Restaurantes",
    specialty: "COMIDAS RAPIDAS",
    deliveryTime: "35 min",
    image: "",
    logo: "",
    hours: "4:00 PM - 10:00 PM",
    opening_time: "16:00",
    closing_time: "22:00",
    status: "closed",
    distances: JSON.stringify({ walk: "3 min", car: "3 min", bike: "3 min" }),
    keywords: JSON.stringify(["Hamburguesas", "Artesanal"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3108426039",
    latitude: "",
    longitude: ""
  },
  {
    name: "TONNY PIZZA",
    category: "Restaurantes",
    specialty: "PIZZAS, LASAGNAS Y PASTA",
    deliveryTime: "15 min",
    image: "",
    logo: "",
    hours: "3:00 PM - 10:00 PM",
    opening_time: "15:00",
    closing_time: "22:00",
    status: "closed",
    distances: JSON.stringify({ walk: "3 min", car: "3 min", bike: "3 min" }),
    keywords: JSON.stringify(["Pizza", "Italiana", "Pasta"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3232857584",
    latitude: "4.522306",
    longitude: "-75.690472"
  },
  {
    name: "LA REBAJA",
    category: "Droguerías",
    specialty: "DROGUERIA",
    deliveryTime: "40 min",
    image: "",
    logo: "",
    hours: "7:30 AM - 9:30 PM",
    opening_time: "07:30",
    closing_time: "21:30",
    status: "closed",
    distances: JSON.stringify({ walk: "3 min", car: "3 min", bike: "3 min" }),
    keywords: JSON.stringify(["Droguería", "Medicamentos"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "",
    latitude: "4.522556",
    longitude: "-75.690806"
  },
  {
    name: "ARA",
    category: "Supermercados",
    specialty: "SUPERMERCADO",
    deliveryTime: "",
    image: "",
    logo: "",
    hours: "",
    opening_time: "",
    closing_time: "",
    status: "closed",
    distances: JSON.stringify({ walk: "", car: "", bike: "" }),
    keywords: JSON.stringify(["Supermercado", "Víveres"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "",
    latitude: "4.522556",
    longitude: "-75.691000"
  },
  {
    name: "TIERRA QUERIDA",
    category: "Restaurantes",
    specialty: "HAMBURGUESAS ARTESANALES",
    deliveryTime: "50 min",
    image: "",
    logo: "",
    hours: "3:00 PM - 11:00 PM",
    opening_time: "15:00",
    closing_time: "23:00",
    status: "closed",
    distances: JSON.stringify({ walk: "", car: "", bike: "" }),
    keywords: JSON.stringify(["Hamburguesas", "Artesanal"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3011203306",
    latitude: "4.522778",
    longitude: "-75.692083"
  },
  {
    name: "D1",
    category: "Supermercados",
    specialty: "SUPERMERCADO",
    deliveryTime: "",
    image: "",
    logo: "",
    hours: "",
    opening_time: "",
    closing_time: "",
    status: "closed",
    distances: JSON.stringify({ walk: "", car: "", bike: "" }),
    keywords: JSON.stringify(["Supermercado", "Descuentos"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "",
    latitude: "4.522417",
    longitude: "-75.692917"
  },
  {
    name: "DOLLARCITY",
    category: "Otros",
    specialty: "VARIEDADES",
    deliveryTime: "",
    image: "",
    logo: "",
    hours: "",
    opening_time: "",
    closing_time: "",
    status: "closed",
    distances: JSON.stringify({ walk: "", car: "", bike: "" }),
    keywords: JSON.stringify(["Variedades", "Hogar"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "",
    latitude: "4.521528",
    longitude: "-75.693194"
  },
  {
    name: "GUTYS",
    category: "Restaurantes",
    specialty: "AREPAS Y ASADO",
    deliveryTime: "35-40 min",
    image: "",
    logo: "",
    hours: "2:30 PM - 10:00 PM",
    opening_time: "14:30",
    closing_time: "22:00",
    status: "closed",
    distances: JSON.stringify({ walk: "4 min", car: "4 min", bike: "4 min" }),
    keywords: JSON.stringify(["Arepas", "Asado"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3127488122",
    latitude: "4.521583",
    longitude: "-75.692917"
  },
  {
    name: "EL PALACIO DE ARROZ",
    category: "Restaurantes",
    specialty: "ARROZ",
    deliveryTime: "40-50 min",
    image: "",
    logo: "",
    hours: "11:00 AM - 7:00 PM",
    opening_time: "11:00",
    closing_time: "19:00",
    status: "closed",
    distances: JSON.stringify({ walk: "6 min", car: "6 min", bike: "6 min" }),
    keywords: JSON.stringify(["Arroz", "Comidas"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3162692064",
    latitude: "4.521583",
    longitude: "-75.692917"
  },
  {
    name: "LAS DELICIAS DE YEYE",
    category: "Restaurantes",
    specialty: "SANDWICH CUBANO",
    deliveryTime: "40 min",
    image: "",
    logo: "",
    hours: "12:00 PM - 9:30 PM",
    opening_time: "12:00",
    closing_time: "21:30",
    status: "closed",
    distances: JSON.stringify({ walk: "", car: "", bike: "" }),
    keywords: JSON.stringify(["Sandwich", "Cubano"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "3122509019",
    latitude: "4.521583",
    longitude: "-75.692917"
  },
  {
    name: "SUPER INTER FERIA DE LOS PLÁTANOS",
    category: "Supermercados",
    specialty: "SUPERMERCADO",
    deliveryTime: "",
    image: "",
    logo: "",
    hours: "",
    opening_time: "",
    closing_time: "",
    status: "closed",
    distances: JSON.stringify({ walk: "", car: "", bike: "" }),
    keywords: JSON.stringify(["Supermercado", "Frutas", "Verduras"]),
    description: "",
    gallery: JSON.stringify([]),
    zone: "Las Acacias",
    whatsapp: "",
    latitude: "4.521639",
    longitude: "-75.692944"
  }
];

function initDb() {
  db.run(`CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    specialty TEXT,
    deliveryTime TEXT,
    image TEXT,
    logo TEXT,
    hours TEXT,
    opening_time TEXT,
    closing_time TEXT,
    status TEXT,
    distances TEXT,
    keywords TEXT,
    description TEXT,
    gallery TEXT,
    latitude TEXT,
    longitude TEXT,
    whatsapp TEXT,
    is_popular INTEGER DEFAULT 0,
    is_nearby INTEGER DEFAULT 0,
    payment_methods TEXT,
    zone TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Table businesses created or already exists.');
      // Attempt to add columns if they don't exist (for existing DBs)
      db.run("ALTER TABLE businesses ADD COLUMN latitude TEXT", (err) => {
        if (!err) console.log("Added latitude column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN longitude TEXT", (err) => {
        if (!err) console.log("Added longitude column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN whatsapp TEXT", (err) => {
        if (!err) console.log("Added whatsapp column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN is_popular INTEGER DEFAULT 0", (err) => {
        if (!err) console.log("Added is_popular column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN is_nearby INTEGER DEFAULT 0", (err) => {
        if (!err) console.log("Added is_nearby column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN opening_time TEXT", (err) => {
        if (!err) console.log("Added opening_time column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN closing_time TEXT", (err) => {
        if (!err) console.log("Added closing_time column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN payment_methods TEXT", (err) => {
        if (!err) console.log("Added payment_methods column");
      });
      db.run("ALTER TABLE businesses ADD COLUMN zone TEXT", (err) => {
        if (!err) console.log("Added zone column");
      });
      seedData();
    }
  });
}

function seedData() {
  db.get("SELECT count(*) as count FROM businesses", (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row.count === 0) {
      console.log("Seeding data...");
      const stmt = db.prepare(`INSERT INTO businesses (name, category, specialty, deliveryTime, image, logo, hours, status, distances, keywords, description, gallery, zone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      BUSINESSES_DATA.forEach(biz => {
        stmt.run(biz.name, biz.category, biz.specialty, biz.deliveryTime, biz.image, biz.logo, biz.hours, biz.status, biz.distances, biz.keywords, biz.description, biz.gallery, biz.zone || 'Las Acacias');
      });
      
      stmt.finalize();
      console.log("Data seeded.");
    } else {
      console.log("Database already has data, skipping seed.");
    }
  });
}

export default db;
