const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { MongoClient, GridFSBucket } = require('mongodb'); // Import GridFSBucket explicitly
const mongoose = require('mongoose'); // Keep mongoose for ObjectId if needed
const connectDB = require('../config'); // Keep this if you still use mongoose elsewhere

const router = express.Router();

const url = process.env.MONGO_URI ; // Default to local MongoDB

let conn, db, gridfsBucket, upload;

// Connect to MongoDB using MongoClient
MongoClient.connect(url)
  .then((client) => {
    console.log('✅ MongoDB connected via MongoClient');
    db = client.db('quotedb'); // Use 'insurance_app' database
    gridfsBucket = new GridFSBucket(db, { bucketName: 'uploads' });

    // Initialize GridFsStorage for multer
    const storage = new GridFsStorage({
      db: db, // Use the MongoDB database instance from MongoClient
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const fileInfo = {
            _id: new mongoose.Types.ObjectId(), // Generate ObjectId for compatibility
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'uploads' // Match the GridFS bucket name
          };
          resolve(fileInfo);
        });
      }
    });

    upload = multer({ storage });
    console.log('✅ Multer GridFS Storage initialized');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Middleware to ensure `upload` is initialized before route execution
function ensureUploadReady(req, res, next) {
  if (!upload) {
    console.error('❌ File upload system not initialized');
    return res.status(500).json({ error: 'File upload system not initialized. Please try again later.' });
  }
  next();
}

// Upload Image
router.post('/upload', ensureUploadReady, (req, res, next) => {
  console.log("Upload request received...");
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload failed:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
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
    const files = await db.collection('uploads.files').find().toArray();
    if (!files || files.length === 0) {
      return res.json([]);
    }

    const images = files.map(file => ({
      _id: file._id.toString(), // Ensure _id is string for JSON response
      filename: file.filename,
      url: `${req.protocol}://${req.get('host')}/images/${file._id}` // Use dynamic host
    }));

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

// Fetch Single Image by ID
router.get('/:id', async (req, res) => {
  try {
    // Validate the ObjectId format
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(req.params.id);
    } catch (error) {
      console.error('Invalid ID format:', error.message);
      return res.status(400).json({ error: 'Invalid ID format', details: error.message });
    }

    const file = await db.collection('uploads.files').findOne({ _id: objectId });

    if (!file) {
      console.error('File not found for ID:', req.params.id);
      return res.status(404).json({ error: 'File not found' });
    }

    // Log file details for debugging
    console.log('Found file:', file);

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream', // Default to octet-stream if contentType is missing
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Access-Control-Allow-Origin': 'http://localhost:3000', // Match Angular origin
      'Access-Control-Expose-Headers': 'Content-Disposition', // Expose headers for binary responses
    }); 

    const readStream = gridfsBucket.openDownloadStream(objectId);
    readStream.on('error', (streamError) => {
      console.error('Stream error for ID', req.params.id, ':', streamError);
      res.status(500).json({ error: 'Failed to stream image', details: streamError.message });
    });
    readStream.pipe(res);
  } catch (error) {
    console.error('Error fetching image for ID', req.params.id, ':', error);
    res.status(500).json({ error: 'Failed to fetch image', details: error.message });
  }
});

module.exports = router;