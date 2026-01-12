import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import BookCard from "./components/BookCard";
import Loader from "./components/Loader";
import NoResults from "./components/NoResults";
import Filters from "./components/Filters";
import BookModal from "./components/BookModal";
import useDebounce from "./hooks/useDebounce";
import "./index.css";

function App() {
  // 🔹 States
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);

  // 🔹 Debounced query
  const debouncedQuery = useDebounce(query, 500);

  // 🔹 Fetch books from API
  // const fetchBooks = async () => {
  //   if (!query) return;

  //   setLoading(true);
  //   try {
  //     const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
  //     const data = await res.json();
  //     setBooks(data.docs.slice(0, 20));
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setLoading(false);
  // };

  const fetchBooks = async () => {
  if (!query || query.length < 3) return; // 🔥 FIX

  setLoading(true);
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );
    // const data = await res.json();
    // setBooks(data.docs.slice(0, 20));
    const data = await res.json();
setBooks(data.docs ? data.docs.slice(0, 20) : []);

  } catch (err) {
    console.error(err);
  }
  setLoading(false);
};

  // 🔹 Auto search on typing (debounce)
  useEffect(() => {
    if (debouncedQuery) {
      fetchBooks();
    }
  }, [debouncedQuery]);

  // 🔹 Favorite add/remove
  const toggleFavorite = (book) => {
    let updatedFavs;

    if (favorites.some((fav) => fav.key === book.key)) {
      updatedFavs = favorites.filter((fav) => fav.key !== book.key);
    } else {
      updatedFavs = [...favorites, book];
    }

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  // 🔹 Modal handlers
  const openDetails = (book) => setSelectedBook(book);
  const closeDetails = () => setSelectedBook(null);

  // 🔹 Filters & Sorting logic
  let filteredBooks = [...books];

  if (filter === "author") {
    filteredBooks = filteredBooks.filter((b) => b.author_name);
  }

  if (filter === "cover") {
    filteredBooks = filteredBooks.filter((b) => b.cover_i);
  }

  if (sort === "title") {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sort === "new") {
    filteredBooks.sort(
      (a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0)
    );
  }

  if (sort === "old") {
    filteredBooks.sort(
      (a, b) => (a.first_publish_year || 0) - (b.first_publish_year || 0)
    );
  }

  return (
    <div className="app">
      <h1>📚 Book Search App</h1>

      {/* 🔍 Search */}
      <SearchBar query={query} setQuery={setQuery} onSearch={fetchBooks} />

      {/* 🔎 Filters */}
      <Filters setSort={setSort} setFilter={setFilter} />

      {/* ⏳ Loader */}
      {loading && <Loader />}

      {/* ❌ No Results */}
      {!loading && query && filteredBooks.length === 0 && <NoResults />}

      {/* 📚 Books List */}
      <div className="books">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            openDetails={openDetails}
          />
        ))}
      </div>

      {/* ❤️ Favorites Section */}
      {favorites.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>❤️ My Favorites</h2>
          <div className="books">
            {favorites.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                openDetails={openDetails}
              />
            ))}
          </div>
        </>
      )}

      {/* 📖 Book Details Modal */}
      <BookModal book={selectedBook} close={closeDetails} />
    </div>
  );
}

export default App;
