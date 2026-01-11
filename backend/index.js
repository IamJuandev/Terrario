import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend build

// API routes are defined below...

// Multer config (Memory storage for processing)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const processImage = async (file) => {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
  const filepath = path.join(__dirname, 'uploads', filename);
  
  await sharp(file.buffer)
    .webp({ quality: 80 })
    .toFile(filepath);
    
  return `/uploads/${filename}`;
};

// Helper to convert FormData string values to boolean
const toBoolean = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
};

// Helper to calculate business status based on opening/closing times
const calculateBusinessStatus = (opening_time, closing_time) => {
  if (!opening_time || !closing_time) return 'closed';
  
  // Calculate current time in Colombia (Bogota)
  const now = new Date();
  const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const currentTime = colombiaTime.getHours() * 60 + colombiaTime.getMinutes(); // Current time in minutes
  
  // Parse opening time (format: "HH:MM")
  const [openHour, openMin] = opening_time.split(':').map(Number);
  const openingMinutes = openHour * 60 + openMin;
  
  // Parse closing time (format: "HH:MM")
  const [closeHour, closeMin] = closing_time.split(':').map(Number);
  const closingMinutes = closeHour * 60 + closeMin;
  
  // Check if currently open
  if (currentTime >= openingMinutes && currentTime < closingMinutes) {
    // Check if closing soon (within 30 minutes)
    if (closingMinutes - currentTime <= 30) {
      return 'closing';
    }
    return 'open';
  }
  
  return 'closed';
};

// Get all businesses
app.get('/api/businesses', (req, res) => {
  db.all("SELECT * FROM businesses", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    // Parse JSON fields and calculate status
    const businesses = rows.map(row => ({
      ...row,
      distances: JSON.parse(row.distances || '{}'),
      keywords: JSON.parse(row.keywords || '[]'),
      gallery: JSON.parse(row.gallery || '[]'),
      payment_methods: JSON.parse(row.payment_methods || '{}'),
      status: calculateBusinessStatus(row.opening_time, row.closing_time)
    }));
    res.json({
      "message": "success",
      "data": businesses
    });
  });
});

// Get single business
app.get('/api/businesses/:id', (req, res) => {
  const sql = "SELECT * FROM businesses WHERE id = ?";
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (row) {
        row.distances = JSON.parse(row.distances || '{}');
        row.keywords = JSON.parse(row.keywords || '[]');
        row.gallery = JSON.parse(row.gallery || '[]');
        row.payment_methods = JSON.parse(row.payment_methods || '{}');
        row.status = calculateBusinessStatus(row.opening_time, row.closing_time);
        res.json({
            "message": "success",
            "data": row
        });
    } else {
        res.status(404).json({ "message": "Business not found" });
    }
  });
});

// Create new business
app.post('/api/businesses', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const { name, category, specialty, deliveryTime, hours, opening_time, closing_time, distances, keywords, description, latitude, longitude, whatsapp, is_popular, is_nearby, payment_methods, zone } = req.body;
    
    let imageUrl = req.body.image || ''; // Fallback to text URL if provided
    let logoUrl = req.body.logo || '';

    let galleryUrls = [];
    try {
      const rawGallery = req.body.gallery_json || req.body.gallery;
      galleryUrls = rawGallery ? JSON.parse(rawGallery) : [];
    } catch (e) {
      console.error("Error parsing gallery JSON:", e);
      galleryUrls = [];
    }

    // Process uploaded files
    if (req.files['image']) {
      imageUrl = await processImage(req.files['image'][0]);
    }
    if (req.files['logo']) {
      logoUrl = await processImage(req.files['logo'][0]);
    }
    if (req.files['gallery']) {
      for (const file of req.files['gallery']) {
        const url = await processImage(file);
        galleryUrls.push(url);
      }
    }

    const sql = 'INSERT INTO businesses (name, category, specialty, deliveryTime, image, logo, hours, opening_time, closing_time, distances, keywords, description, gallery, latitude, longitude, whatsapp, is_popular, is_nearby, payment_methods, zone) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const params = [
      name, 
      category, 
      specialty, 
      deliveryTime, 
      imageUrl, 
      logoUrl, 
      hours,
      opening_time,
      closing_time, 
      distances, // Already stringified by client or handled below? Client sends stringified JSON in FormData usually as text
      keywords, 
      description, 
      JSON.stringify(galleryUrls),
      latitude,
      longitude,
      whatsapp,
      toBoolean(is_popular) ? 1 : 0,
      toBoolean(is_nearby) ? 1 : 0,
      payment_methods,
      req.body.zone // Add zone to params
    ];
    
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID, ...req.body },
        "id": this.lastID
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing request" });
  }
});

// Update business
app.put('/api/businesses/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), async (req, res) => {
  try {
    const { name, category, specialty, deliveryTime, hours, opening_time, closing_time, distances, keywords, description, latitude, longitude, whatsapp, is_popular, is_nearby, payment_methods } = req.body;
    
    let imageUrl = req.body.image;
    let logoUrl = req.body.logo;

    let galleryUrls = null;
    try {
       // Look for gallery_json (new frontend) or gallery (fallback)
       const rawGallery = req.body.gallery_json || req.body.gallery;
       galleryUrls = rawGallery ? JSON.parse(rawGallery) : null; 
    } catch (e) {
       console.error("Error parsing gallery JSON:", e);
       galleryUrls = [];
    }

    if (req.files['image']) {
      imageUrl = await processImage(req.files['image'][0]);
    }
    if (req.files['logo']) {
      logoUrl = await processImage(req.files['logo'][0]);
    }
    if (req.files['gallery']) {
      if (!galleryUrls) galleryUrls = [];
      for (const file of req.files['gallery']) {
        const url = await processImage(file);
        galleryUrls.push(url);
      }
    }

    const sql = `UPDATE businesses set 
      name = COALESCE(?,name), 
      category = COALESCE(?,category), 
      specialty = COALESCE(?,specialty), 
      deliveryTime = COALESCE(?,deliveryTime), 
      image = COALESCE(?,image), 
      logo = COALESCE(?,logo), 
      hours = COALESCE(?,hours), 
      opening_time = COALESCE(?,opening_time),
      closing_time = COALESCE(?,closing_time),
      distances = COALESCE(?,distances), 
      keywords = COALESCE(?,keywords), 
      description = COALESCE(?,description), 
      gallery = COALESCE(?,gallery),
      latitude = COALESCE(?,latitude),
      longitude = COALESCE(?,longitude),
      whatsapp = COALESCE(?,whatsapp),
      is_popular = COALESCE(?,is_popular),
      is_nearby = COALESCE(?,is_nearby),
      payment_methods = COALESCE(?,payment_methods),
      zone = COALESCE(?,zone)
      WHERE id = ?`;
      
    const params = [
      name, 
      category, 
      specialty, 
      deliveryTime, 
      imageUrl, 
      logoUrl, 
      hours,
      opening_time,
      closing_time, 
      distances, 
      keywords, 
      description, 
      galleryUrls ? JSON.stringify(galleryUrls) : null, 
      latitude,
      longitude,
      whatsapp,
      is_popular !== undefined ? (toBoolean(is_popular) ? 1 : 0) : null,
      is_nearby !== undefined ? (toBoolean(is_nearby) ? 1 : 0) : null,
      payment_methods,
      req.body.zone,
      req.params.id
    ];

    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": req.body,
        "changes": this.changes
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing request" });
  }
});

// Delete business
app.delete('/api/businesses/:id', (req, res) => {
  db.run(
    'DELETE FROM businesses WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ "error": res.message });
        return;
      }
      res.json({ "message": "deleted", changes: this.changes });
  });
});

// Handle React routing, return all requests to React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
