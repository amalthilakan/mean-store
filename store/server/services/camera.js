const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Photo Schema
const PhotoSchema = new mongoose.Schema({
    image: String, 
    createdAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', PhotoSchema);

// POST: Upload a new photo
app.post('/photos/upload', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ message: "No image data provided" });
        }
        const newPhoto = new Photo({ image });
        await newPhoto.save();
        res.status(201).json({ message: "Photo saved successfully!", photo: newPhoto });
    } catch (error) {
        console.error("Error saving photo:", error);
        res.status(500).json({ message: "Error saving photo", error: error.message });
    }
});

// GET: Retrieve all photos
app.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.find().sort({ createdAt: -1 }); 
        res.json(photos);
    } catch (error) {
        console.error("Error fetching photos:", error);
        res.status(500).json({ message: "Error fetching photos", error: error.message });
    }
});

// Optional: GET a single photo by ID
app.get('/photos/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ message: "Photo not found" });
        }
        res.json(photo);
    } catch (error) {
        console.error("Error fetching photo:", error);
        res.status(500).json({ message: "Error fetching photo", error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));