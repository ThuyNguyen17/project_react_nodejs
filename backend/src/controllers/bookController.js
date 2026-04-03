// controllers/bookController.js
const Book = require('../models/Book');

// 🔹 CREATE
exports.addBook = async (req, res) => {
    try {
        await Book.create(req.body);

        res.json({
            success: true,
            message: "Book Created!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 GET ALL
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();

        res.json({
            success: true,
            books
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 UPDATE
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        await Book.findByIdAndUpdate(id, req.body);

        res.json({
            success: true,
            message: "Book Updated!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔹 DELETE
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        await Book.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Book Deleted!"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};