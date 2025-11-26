import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'terrario.db'), (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

const DATA_FILE = path.join(__dirname, '../datos.txt');

function parseTime(timeStr) {
    if (!timeStr) return null;
    // Normalize
    let s = timeStr.toLowerCase().trim();
    
    // Simple 24h or 12h parsing logic
    // This is a best-effort parser for the specific format in datos.txt
    // Examples: "5 a 11", "6:00 PM A 12", "10 am a 8:30"
    
    // Helper to convert "5" or "5:30" or "5 pm" to "HH:MM"
    const convertTo24Hour = (t) => {
        t = t.trim();
        let isPm = t.includes('pm') || t.includes('p.m.');
        let isAm = t.includes('am') || t.includes('a.m.');
        let cleanT = t.replace(/[a-z\.]/g, '').trim();
        
        let [h, m] = cleanT.split(':').map(Number);
        if (!m) m = 0;
        
        if (isPm && h < 12) h += 12;
        if (isAm && h === 12) h = 0;
        
        // Heuristic for missing AM/PM based on typical business hours
        // If hour is between 1 and 6, and no AM/PM, assume PM (afternoon/evening) unless it's clearly morning (e.g. 5am bakery?)
        // But "5 a 11" usually means 5 PM to 11 PM for restaurants.
        // "10 am a 8:30" -> 10:00 to 20:30.
        
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    // Split by " a " or " y " or "-"
    let parts = s.split(/ a | y |-/);
    if (parts.length < 2) return { open: null, close: null };
    
    let openRaw = parts[0];
    let closeRaw = parts[1]; // Take the first range if multiple? "3 a 11 y 2:30 a 11:30" -> complex.
    
    // Handle "3 a 11 y 2:30 a 11:30" -> Just take the first one for now or try to merge?
    // The schema only supports one opening/closing time.
    
    // Better heuristic:
    // If we see "pm" in the second part but not first, apply it to first if ambiguous?
    // E.g. "5 a 11" -> likely 17:00 to 23:00.
    
    const parseSingleTime = (raw, isEnd = false) => {
        raw = raw.trim();
        let isPm = raw.includes('pm');
        let isAm = raw.includes('am');
        let clean = raw.replace(/[a-z\.]/g, '').trim();
        let [h, m] = clean.split(':').map(Number);
        if (isNaN(h)) return "00:00";
        if (!m) m = 0;
        
        // Heuristics
        if (!isPm && !isAm) {
            // If it's closing time (isEnd) and small number (e.g. 1, 2, 3), it's likely AM (next day) or PM?
            // "11" -> 23:00 usually. "12" -> 00:00 or 12:00?
            // "5 a 11" -> 17:00 to 23:00
            // "3 a 11" -> 15:00 to 23:00
            if (h <= 4) {
                 // 1, 2, 3, 4 -> Likely PM (13, 14...) or AM next day?
                 // For "3 a 11", 3 is likely 15:00.
                 if (!isEnd) h += 12; 
            } else if (h >= 5 && h <= 11) {
                 // 5 to 11. 
                 // If start is 5, likely 17:00. If start is 10, could be 10:00 or 22:00.
                 // "10 am" is explicit. "5" is ambiguous.
                 // Let's assume PM for start if < 12 and no AM specified, unless it's 7-11 range which might be breakfast?
                 // Most places in list are food/fast food -> PM.
                 if (!isEnd) h += 12;
                 else h += 12; // End 11 -> 23:00.
            }
            if (h === 12 && !isEnd) {
                // 12 -> 12:00 PM usually
            }
            if (h === 24) h = 0;
        } else {
             if (isPm && h < 12) h += 12;
             if (isAm && h === 12) h = 0;
        }
        
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return {
        open: parseSingleTime(openRaw, false),
        close: parseSingleTime(closeRaw, true)
    };
}

function parseCoordinates(locStr) {
    if (!locStr) return { lat: null, lon: null };
    // Format: 4°31'17.8"N 75°41'20.5"W
    // Or URL
    
    if (locStr.includes('http')) {
        // Can't easily extract coords from short links without following them.
        // We will leave null for now or try to extract if it's a full google maps link with coords.
        return { lat: null, lon: null };
    }
    
    const dmsRegex = /(\d+)°(\d+)'([\d\.]+)"([NS])\s*(\d+)°(\d+)'([\d\.]+)"([EW])/;
    const match = locStr.match(dmsRegex);
    
    if (match) {
        const [_, d1, m1, s1, dir1, d2, m2, s2, dir2] = match;
        
        let lat = parseFloat(d1) + parseFloat(m1)/60 + parseFloat(s1)/3600;
        if (dir1 === 'S') lat = -lat;
        
        let lon = parseFloat(d2) + parseFloat(m2)/60 + parseFloat(s2)/3600;
        if (dir2 === 'W') lon = -lon;
        
        return { lat: lat.toFixed(6), lon: lon.toFixed(6) };
    }
    
    return { lat: null, lon: null };
}

const processFile = () => {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---') && !l.includes('NOMBRE DEL ESTABLECIMIENTO'));
    
    const businesses = lines.map(line => {
        const cols = line.split('|').map(c => c.trim());
        // cols[0] is empty (before first |), cols[1] is #, cols[2] is Name...
        // | 1 | TROPIWINGS | ...
        // cols: ["", "1", "TROPIWINGS", ...]
        
        if (cols.length < 10) return null;

        const name = cols[2];
        const category = cols[3];
        const hoursRaw = cols[4];
        const deliveryTime = cols[5];
        const distWalk = cols[6];
        const distMoto = cols[7];
        const distCar = cols[8];
        const locationRaw = cols[9];
        const whatsapp = cols[10];
        const keywordsRaw = cols[11];
        const hasLogo = cols[12];
        const hasPhotos = cols[13];
        
        const timeObj = parseTime(hoursRaw) || { open: null, close: null };
        const { open, close } = timeObj;
        const { lat, lon } = parseCoordinates(locationRaw);
        
        const distances = {
            walking: distWalk ? `${distWalk} min` : "",
            motorcycle: distMoto ? `${distMoto} min` : "",
            car: distCar ? `${distCar} min` : ""
        };
        
        // Keywords
        let keywords = [];
        if (keywordsRaw) {
            keywords.push(keywordsRaw);
        }
        
        // Default images
        // We don't have real URLs in the text file, so we use placeholders or empty.
        // The user said "TIENE LOGO" is empty for most.
        // We will use empty strings and let the frontend handle defaults or use the DEFAULT_IMAGES logic.
        
        return {
            name,
            category,
            specialty: category, // Use category as specialty for now or leave blank? The table has "CATEGORIA" which looks like "ALITAS & COSTILLAS".
            deliveryTime,
            image: "", 
            logo: "",
            hours: hoursRaw,
            opening_time: open,
            closing_time: close,
            distances: JSON.stringify(distances),
            keywords: JSON.stringify(keywords),
            description: `${name} - ${category}`,
            gallery: "[]",
            latitude: lat,
            longitude: lon,
            whatsapp,
            is_popular: 0,
            is_nearby: 1, // Assume all in list are nearby/local
            payment_methods: "{}"
        };
    }).filter(b => b !== null);
    
    return businesses;
};

const seed = () => {
    const businesses = processFile();
    
    db.serialize(() => {
        db.run("DELETE FROM businesses");
        db.run("DELETE FROM sqlite_sequence WHERE name='businesses'"); // Reset ID counter
        
        const stmt = db.prepare(`INSERT INTO businesses (
            name, category, specialty, deliveryTime, image, logo, hours, 
            opening_time, closing_time, distances, keywords, description, 
            gallery, latitude, longitude, whatsapp, is_popular, is_nearby, payment_methods
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        
        businesses.forEach(biz => {
            stmt.run(
                biz.name, biz.category, biz.specialty, biz.deliveryTime, biz.image, biz.logo, biz.hours,
                biz.opening_time, biz.closing_time, biz.distances, biz.keywords, biz.description,
                biz.gallery, biz.latitude, biz.longitude, biz.whatsapp, biz.is_popular, biz.is_nearby, biz.payment_methods
            );
        });
        
        stmt.finalize();
        console.log(`Inserted ${businesses.length} businesses.`);
    });
    
    db.close();
};

seed();
