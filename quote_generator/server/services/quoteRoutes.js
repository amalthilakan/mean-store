const express = require('express');
const Quote = require('../models/quoteModel');
const router = express.Router();

// GET all quotes
router.get('/quote', async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ date: -1 });
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quotes', error });
    }
});

// POST a new quote
router.post('/quote', async (req, res) => {
    try {
        const { text, author } = req.body;
        const newQuote = new Quote({ text, author });
        await newQuote.save();
        res.json(newQuote);
    } catch (error) {
        res.status(400).json({ message: 'Error adding quote', error });
    }
});

// DELETE a quote by ID
router.delete('/quote/:id', async (req, res) => {
    try {
        const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
        if (!deletedQuote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.json({ message: 'Quote deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quote', error });
    }
});

module.exports = router;
