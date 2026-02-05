const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true, // Reflect request origin
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.get('/debug', (req, res) => {
    res.json({
        message: 'Debug Info',
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        path: req.path,
        headers: req.headers
    });
});
app.get('/api/debug', (req, res) => {
    res.json({
        message: 'Debug Info (API)',
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        path: req.path,
        headers: req.headers
    });
});

// Mount routes
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// MongoDB Connection
const connectDB = async () => {
    try {
        const opts = {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, opts);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

// Middleware to ensure DB is connected (redundant if we connect before starting, but kept for safety)
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1 && !['/', '/debug', '/favicon.ico'].includes(req.path)) {
        try {
            await connectDB();
            next();
        } catch (error) {
            res.status(500).json({ message: 'Database connection failed' });
        }
    } else {
        next();
    }
});

// Final catch-all for debugging 404s
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url}`);
    res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

module.exports = app;

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}
