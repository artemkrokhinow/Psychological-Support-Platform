const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String },
    icon: { type: String },
    notes: { type: String },
    duration: { type: String },
    fullText: { type: String },
    url: { type: String }
});

module.exports = mongoose.model('Material', MaterialSchema);