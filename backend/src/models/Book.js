const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    bookname: { type: String },
    title: { type: String },
    author: { type: String },
    description: { type: String },
    category: { type: String, default: 'General' },
    cover: { type: String, default: '📚' },
    available: { type: Boolean, default: true },
    dueDate: { type: Date },
    borrowedBy: { type: String },
    pdfUrl: { type: String },
    coverUrl: { type: String }
}, { collection: 'library', timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
