 const DEFAULT_COVER =
  " ./public/default image.jpg";

function BookCard({ book, favorites, toggleFavorite, openDetails }) {
  const isFav = favorites.some((fav) => fav.key === book.key);

  const coverImg = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : DEFAULT_COVER;

  return (
    <div className="book-card">
      <img
        src={coverImg}
        alt={book.title}
        onClick={() => openDetails(book)}
        onError={(e) => {
          e.target.src = DEFAULT_COVER;
        }}
      />

      <h3>{book.title}</h3>
      <p><b>Author:</b> {book.author_name?.[0] || "Unknown"}</p>
      <p><b>Year:</b> {book.first_publish_year || "N/A"}</p>

      <button className="fav-btn" onClick={() => toggleFavorite(book)}>
        {isFav ? " 🤍Remove" : "❤️ Add"}
      </button>
    </div>
  );
}

export default BookCard;
