const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
require('dotenv').config();

const listRoutes = require('./services/listRoutes');
const galleryRoutes = require('./services/gallery');
const translation = require('./services/translation')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:5500',,
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));

// app.use(cors({
//     origin: '*'
// }))

// Allow Preflight Requests for CORS
app.options('*', cors());

// ✅ Connect to MongoDB
connectDB();

// ✅ Ensure Routes Are Correct
app.use('/', listRoutes);
app.use('/images', galleryRoutes);
app.use('/translate', translation);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
