const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    filename: String,
    contentType: String
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
