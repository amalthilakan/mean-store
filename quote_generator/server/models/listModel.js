const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    items: { type: [String], required: true },
    date: { type: Date, default: Date.now },
});

const List = mongoose.model('List', listSchema);
module.exports = List;
