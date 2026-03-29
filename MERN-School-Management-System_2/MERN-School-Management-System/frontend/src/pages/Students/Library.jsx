import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
    LibraryContainer,
    SidebarContainer,
    Content,
    LibraryHeader,
    BookList,
    BookItem,
    BookTitle,
    BorrowButton
} from "../../styles/LibraryStyles";

const LibrarySection = () =>{
    const [isOpen, setIsOpen] = useState(true);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/library/getall');
            setBooks(response.data.books || []);
        } catch (error) {
            console.error('Error fetching books: ', error);
        }
    };

    const handleBorrowBook = (bookId) => {
        alert(`Bạn đã đăng ký mượn sách ID: ${bookId}. Vui lòng đến thư viện để nhận sách!`);
    };

    return(
        <LibraryContainer>
            <SidebarContainer>
                <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            </SidebarContainer>
            <Content isOpen={isOpen}>
                <LibraryHeader>Library Books</LibraryHeader>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {books.map((book) => (
                        <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: 'white' }}>
                            <BookTitle>{book.bookname}</BookTitle>
                            <p>Author: {book.author}</p>
                            <BorrowButton onClick={() => handleBorrowBook(book.id)}>Borrow</BorrowButton>
                        </div>
                    ))}
                </div>
            </Content>
        </LibraryContainer>
    )
}

export default LibrarySection