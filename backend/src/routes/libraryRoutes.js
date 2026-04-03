const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/getall', async (req, res) => {
    try {
        const books = await Book.find();
        res.json({ books });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new book
router.post('/', async (req, res) => {
    const book = new Book(req.body);
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update book
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search books
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { bookname: { $regex: query, $options: 'i' } }
            ]
        });
        res.json({ books });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
