import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    LibraryContainer,
    Content,
    Title,
    AddBookForm,
    FormGroup,
    Label,
    Input,
    Button,
    BookList,
    BookItem,
    BookTitle,
    BookAuthor,
    ActionButton
} from "../../styles/LibraryStyles";

const Library = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('/api/v1/library/getall');
            setBooks(response.data.books || []);
        } catch (error) {
            console.error('Error fetching books: ', error);
        }
    };

    const addBook = async (title, author) => {
        try {
            await axios.post('/api/v1/library', {
                bookname: title,
                author: author,
            });
            fetchBooks();
        } catch (error) {
            console.error("Error adding book: ", error);
        };
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/library/${id}`);
            fetchBooks();
        } catch (error) {
            console.error("Error deleting book: ", error);
        }
    };

    return (
        <LibraryContainer>
            <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            <Content isOpen={isOpen}>
                <Title>Library Management</Title>
                <AddBookForm onSubmit={(e) => {
                    e.preventDefault();
                    addBook(e.target.title.value, e.target.author.value);
                    e.target.reset();
                }}>
                    <h2>Add New Book</h2>
                    <FormGroup>
                        <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" name="title" required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="author">Author</Label>
                        <Input type="text" id="author" name="author" required />
                    </FormGroup>
                    <Button type="submit">Add Book</Button>
                </AddBookForm>

                <h2>Books List</h2>
                <BookList>
                    { Array.isArray(books) && books.map((book) => (
                        <BookItem key={book._id || book.id}>
                            <BookTitle>{book.bookname}</BookTitle>
                            <BookAuthor>{book.author}</BookAuthor>
                            <ActionButton onClick={() => handleDelete(book._id || book.id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</ActionButton>
                        </BookItem>
                    ))}
                </BookList>
            </Content>
        </LibraryContainer>
    )
}

export default Library