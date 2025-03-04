const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { MongoClient, GridFSBucket } = require('mongodb'); 
const mongoose = require('mongoose');
const connectDB = require('../config'); 

const router = express.Router();

const url = process.env.MONGO_URI ; 

let conn, db, gridfsBucket, upload;


MongoClient.connect(url)
  .then((client) => {
    console.log('✅ MongoDB connected via MongoClient');
    db = client.db('quotedb');
    gridfsBucket = new GridFSBucket(db, { bucketName: 'uploads' });

    const storage = new GridFsStorage({
      db: db, 
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const fileInfo = {
            _id: new mongoose.Types.ObjectId(),
            filename: `${Date.now()}-${file.originalname}`,
            bucketName: 'uploads'
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
    process.exit(1);
  });

function ensureUploadReady(req, res, next) {
  if (!upload) {
    console.error('❌ File upload system not initialized');
    return res.status(500).json({ error: 'File upload system not initialized. Please try again later.' });
  }
  next();
}

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
      _id: file._id.toString(),
      filename: file.filename,
      url: `${req.protocol}://${req.get('host')}/images/${file._id}`
    }));

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
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

    console.log('Found file:', file);

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream', 
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Expose-Headers': 'Content-Disposition',
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