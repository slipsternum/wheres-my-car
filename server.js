import express from 'express';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// ESM directory path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.VITE_APP_BASE_URL || '/';

// Database file path resolution
const envDbFile = process.env.DB_FILE;
const DB_FILE = envDbFile
    ? (path.isAbsolute(envDbFile) ? envDbFile : path.join(__dirname, envDbFile))
    : path.join(__dirname, 'db.json');

console.log(`[SERVER] Database file: ${DB_FILE}`);

// Middleware
app.use(express.json());

// Serve the Vite build output (dist folder) instead of 'public'
app.use(BASE_URL, express.static(path.join(__dirname, 'dist')));

// --- Database Logic ---
const getDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        // Default DB structure
        const initialData = {
            config: {
                cars: [],
                floors: ['1', '2', '3'],
                sections: ['A', 'B'],
                gridColumns: 2
            },
            status: {}
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};

const saveDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- API Router ---
const apiRouter = express.Router();

// Authentication Middleware: User-Based Key Check
apiRouter.use((req, res, next) => {
    const apiKey = req.query.key;
    const db = getDB();

    // Root Admin Authentication via master password
    const adminPass = process.env.VITE_ADMIN_PASSWORD || 'admin123';
    // Base64 encoding for basic obfuscation
    const rootKey = Buffer.from(adminPass).toString('base64');

    // Inject Root User into the list of valid users
    const validUsers = [
        ...(db.users || []),
        { name: 'Root Admin', key: rootKey, isRoot: true }
    ];

    // Find user with matching key
    const user = validUsers.find(u => u.key === apiKey);

    if (user) {
        req.user = user;
        next();
    } else {
        console.warn(`[SECURITY] Blocked unauthorized request from ${req.ip} with key: ${apiKey || 'none'}`);
        res.status(403).json({ error: 'Unauthorized: Invalid or missing API key' });
    }
});

// Loading state simulation delay
const DELAY_MS = parseInt(process.env.ARTIFICIAL_DELAY_MS) || 500; // Configurable delay
if (DELAY_MS > 0) {
    apiRouter.use(async (req, res, next) => {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        next();
    });
}

// --- User Management Endpoints ---
apiRouter.get('/users', (req, res) => {
    const db = getDB();
    // Return users list including API keys for admin management
    res.json(db.users || []);
});

apiRouter.post('/users', (req, res) => {
    const { name, key } = req.body;
    if (!name || !key) {
        return res.status(400).json({ error: 'Missing name or key' });
    }

    const db = getDB();
    if (!db.users) db.users = [];

    const newUser = {
        name,
        key,
        createdAt: Date.now()
    };

    db.users.push(newUser);
    saveDB(db);

    console.log(`[USER] Created new user: ${name}`);
    res.json({ success: true, user: newUser });
});

apiRouter.delete('/users/:key', (req, res) => {
    const { key } = req.params;
    const db = getDB();

    if (!db.users) return res.json({ success: false });

    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.key !== key);

    if (db.users.length < initialLength) {
        saveDB(db);
        console.log(`[USER] Deleted user with key: ${key}`);
    }

    res.json({ success: true });
});


apiRouter.get('/config', (req, res) => {
    const db = getDB();
    res.json(db.config);
});

apiRouter.post('/config', (req, res) => {
    const { cars, floors, sections, gridColumns, customIcons } = req.body;

    // Basic validation
    if (!cars || !floors || !sections) {
        return res.status(400).json({ error: 'Invalid config structure' });
    }

    const db = getDB();
    // Merge updates
    db.config = { ...db.config, cars, floors, sections, gridColumns, customIcons };
    saveDB(db);
    res.json({ success: true, config: db.config });
});

apiRouter.get('/status', (req, res) => {
    const db = getDB();
    res.json(db.status);
});

apiRouter.post('/park', (req, res) => {
    const { carId, location, timestamp, user } = req.body;

    if (!carId || !location) {
        return res.status(400).json({ error: 'Missing carId or location' });
    }

    const db = getDB();
    const carName = db.config.cars.find(c => c.id === carId)?.name || 'Car';
    // Use the name from the Authenticated User if available, otherwise fallback to body's user
    const finalUser = user || (req.user ? req.user.name : 'Unknown');

    db.status[carId] = {
        location,
        timestamp: timestamp || Date.now(),
        // Store the provided user name or fall back to authenticated identity
        user: finalUser
    };

    saveDB(db);
    console.log(`[PARK] ${carName} parked at ${location} by ${finalUser}`);

    res.json({ success: true, status: db.status[carId] });
});

// Configure API Mount Paths
const apiMountPath = BASE_URL.endsWith('/') ? `${BASE_URL}api` : `${BASE_URL}/api`;

console.log(`[SERVER] Mounting API endpoints at: ${apiMountPath}`);
app.use(apiMountPath, apiRouter);

// Catch-all to serve React app for non-API routes
app.get(['/', new RegExp(`^${BASE_URL}.*`)], (req, res) => {
    // Serve static frontend assets
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Parking Server running at http://localhost:${PORT}`);
});