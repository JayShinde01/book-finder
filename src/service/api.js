import axios from "axios";

const BASE_URL = "https://openlibrary.org/search.json";

/**
 * 🔎 Search books by filters (title, author, year, language)
 */
export const searchBooks = async (query, filters = {}) => {
  try {
    let url = `${BASE_URL}?`;

    // ✅ Build query dynamically
    if (filters.query) {
      url += `title=${encodeURIComponent(filters.query)}&`;
    }
    if (filters.author) {
      url += `author=${encodeURIComponent(filters.author)}&`;
    }
    if (filters.year) {
      url += `first_publish_year=${encodeURIComponent(filters.year)}&`;
    }
    if (filters.language) {
      url += `language=${encodeURIComponent(filters.language)}&`;
    }

    // ✅ fallback: if no filters, use generic query
    if (!filters.query && !filters.author && !filters.year && !filters.language && query) {
      url += `q=${encodeURIComponent(query)}`;
    }

    const res = await axios.get(url);
    return res.data.docs.slice(0, 20).map((book) => ({
      key: book.key,
      title: book.title,
      author_name: book.author_name || [],
      first_publish_year: book.first_publish_year || "N/A",
      language: book.language || [],
      edition_count: book.edition_count || 0,
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/200x300?text=No+Cover",
    }));
  } catch (err) {
    console.error("Error fetching books:", err);
    return [];
  }
};

/**
 * 📚 Fetch some default books (e.g. "Harry Potter")
 */
export const getAllBooks = async () => {
  try {
    const res = await axios.get(`${BASE_URL}?q=harry+potter`);
    return res.data.docs.slice(0, 20).map((book) => ({
      key: book.key,
      title: book.title,
      author_name: book.author_name || [],
      first_publish_year: book.first_publish_year || "N/A",
      language: book.language || [],
      edition_count: book.edition_count || 0,
      cover: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/200x300?text=No+Cover",
    }));
  } catch (err) {
    console.error("Error fetching default books:", err);
    return [];
  }
};
