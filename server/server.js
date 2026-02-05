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
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    // If connected, return connection
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // If disconnected (0) or disconnecting (3), reset promise to force new connection
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
        cached.promise = null;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable buffering to fail fast
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected');
            return mongoose;
        }).catch((err) => {
            console.error('MongoDB Connection Init Error:', err);
            cached.promise = null; // Reset promise on failure
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    if (req.path === '/' || req.path === '/debug' || req.path === '/favicon.ico') {
        return next();
    }

    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection middleware error:', error);
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message,
            details: 'Please check server logs for connection timeout details.'
        });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
