import BookCard from "./BookCard";

const BookList = ({ books, onBookClick }) => {
  return (
    <div>
      {books.map((book) => (
        <BookCard key={book.key} book={book} onClick={() => onBookClick(book)} />
      ))}
    </div>
  );
};

export default BookList;
