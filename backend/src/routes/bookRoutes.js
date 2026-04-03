// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

// CREATE
router.post('/', controller.addBook);

// GET
router.get('/getall', controller.getAllBooks);

// UPDATE + DELETE
router.put('/:id', controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;