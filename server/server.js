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

// Mount routes on both /api and root to handle potential different Vercel rewrite behaviors
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/notes', require('./routes/noteRoutes'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes'));

// MongoDB Connection logic for Serverless
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected');
            return mongoose;
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

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    // Skip DB connection for simple health check if desired, but keeping it simple
    if (req.path === '/') {
        return next();
    }

    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            message: 'Database connection failed. Please check server logs.',
            error: error.message
        });
    }
});

// Export for Vercel
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

