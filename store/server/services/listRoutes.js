const express = require('express');
const List = require('../models/listModel'); 
const router = express.Router();

// GET all lists
router.get('/lists', async (req, res) => {
    try {
        const lists = await List.find().sort({ date: -1 });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lists', error });
    }
});

// POST a new list
router.post('/lists', async (req, res) => {
    try {
        const { items } = req.body;
        const newList = new List({ items });
        await newList.save();
        res.json(newList);
    } catch (error) {
        res.status(400).json({ message: 'Error adding list', error });
    }
});

// DELETE a list by ID
router.delete('/lists/:id', async (req, res) => {
    try {
        const deletedList = await List.findByIdAndDelete(req.params.id);
        if (!deletedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.json({ message: 'List deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting list', error });
    }
});

module.exports = router;
