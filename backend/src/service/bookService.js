const Book = require('../models/Book');

const addBook = async (bookData) => {
    const book = new Book(bookData);
    return await book.save();
};

const getAllBooks = async () => {
    return await Book.find();
};

const updateBook = async (id, bookData) => {
    return await Book.findByIdAndUpdate(id, bookData, { new: true });
};

const deleteBook = async (id) => {
    return await Book.findByIdAndDelete(id);
};

module.exports = {
    addBook,
    getAllBooks,
    updateBook,
    deleteBook
};
