const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const connectDB = require('../config');

const router = express.Router();

// Ensure MongoDB is connected
connectDB();

// const conn = mongoose.connection; 
// let gfs, gridfsBucket, upload;

// // Wait for MongoDB connection to open before initializing GridFS
// conn.once('open', () => {
//     console.log('✅ MongoDB connected, initializing GridFS...');
//     gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
//     gfs = gridfsBucket;

//     // Initialize multer-gridfs-storage AFTER connection is ready
//     const storage = new GridFsStorage({
//         url: process.env.MONGO_URI, // ✅ Use connection string instead of `db`
//         file: (req, file) => ({
//             filename: `${Date.now()}-${file.originalname}`,
//             bucketName: 'images'
//         })
//     });
    

//     upload = multer({ storage }); // ✅ Define upload here

//     console.log('✅ Multer GridFS Storage initialized');
// });

const conn = mongoose.connection;
let gfs, gridfsBucket;

// ✅ Initialize multer-gridfs-storage BEFORE waiting for MongoDB connection
const storage = new GridFsStorage({
    url: process.env.MONGO_URI, // ✅ Use connection string instead of `db`
    file: (req, file) => ({
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'images'
    })
});

const upload = multer({ storage }); // ✅ Define `upload` here, outside the connection block

// Wait for MongoDB connection to open before initializing GridFS
conn.once('open', () => {
    console.log('✅ MongoDB connected, initializing GridFS...');
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'images' });
    gfs = gridfsBucket;

    console.log('✅ GridFS Initialized');
});

// Middleware to ensure `upload` is initialized before route execution
function ensureUploadReady(req, res, next) {
    if (!upload) {
        console.error('❌ File upload system not initialized');
        return res.status(500).json({ error: 'File upload system not initialized' });
    }
    next();
}

// Upload Image (✅ Fix: Moved upload definition inside route)
router.post('/upload', ensureUploadReady, (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error('❌ Upload failed:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        if (!req.file) {
            console.error('❌ No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('✅ File uploaded:', req.file);
        res.json({ file: req.file });
    });
});

// Fetch All Images Metadata
router.get('/', async (req, res) => {
    try {
        const files = await conn.db.collection('images.files').find().toArray();
        if (!files || files.length === 0) {
            return res.json([]);
        }

        const images = files.map(file => ({
            _id: file._id,
            filename: file.filename,
            url: `http://localhost:3000/images/${file._id}`
        }));

        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Fetch Single Image by ID
router.get('/:id', async (req, res) => {
    try {
        const file = await conn.db.collection('images.files').findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.set({
            'Content-Type': file.contentType,
            'Content-Disposition': `inline; filename="${file.filename}"`,
            'Access-Control-Allow-Origin': '*',
        });

        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

module.exports = router;