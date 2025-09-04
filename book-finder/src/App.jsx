import { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Spin,
  Empty,
  Modal,
  Switch,
  theme,
  ConfigProvider,
  notification,
} from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import { searchBooks, getAllBooks } from "./service/api";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  // ✅ Load default books when app starts
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const results = await getAllBooks();
        setBooks(results);
        api.success({
          message: "Books Loaded",
          description: "Showing recommended books for you 📚",
          placement: "topRight",
        });
      } catch (err) {
        api.error({
          message: "Error",
          description: "Could not load books ❌",
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ✅ Search handler
  const handleSearch = async (query, filters) => {
    setLoading(true);
    try {
      const results = await searchBooks(query, filters);
      setBooks(results);

      if (results.length > 0) {
        api.success({
          message: "Search Complete",
          description: `Found ${results.length} books 🔍`,
          placement: "topRight",
        });
      } else {
        api.warning({
          message: "No Results",
          description: "Try different keywords or filters.",
          placement: "topRight",
        });
      }
    } catch (err) {
      api.error({
        message: "Error",
        description: "Search failed. Please try again later ❌",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#1890ff", borderRadius: 12 },
      }}
    >
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            background: isDark
              ? "linear-gradient(90deg, #141414, #1f1f1f)"
              : "linear-gradient(90deg, #1890ff, #73d13d)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <Title
            style={{
              color: "white",
              margin: 0,
              fontSize: "1.4rem",
              textAlign: "center",
            }}
            level={3}
          >
            📚 Alex’s Book Finder
          </Title>
          <Switch
            checkedChildren={<BulbFilled />}
            unCheckedChildren={<BulbOutlined />}
            checked={isDark}
            onChange={(checked) => setIsDark(checked)}
          />
        </Header>

        <Content
          style={{
            padding: "20px",
            maxWidth: 900,
            margin: "auto",
          }}
        >
          <SearchBar onSearch={handleSearch} />

          {loading ? (
            <Spin
              size="large"
              style={{ display: "block", margin: "40px auto" }}
            />
          ) : books.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BookList books={books} onBookClick={setSelectedBook} />
            </motion.div>
          ) : (
            <Empty description="No books found" style={{ marginTop: 60 }} />
          )}
        </Content>

        {/* ✅ Book Details Modal with animation */}
        <AnimatePresence>
          {selectedBook && (
            <Modal
              open={!!selectedBook}
              onCancel={() => setSelectedBook(null)}
              title={selectedBook?.title}
              footer={null}
              centered
              width={500}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: "center" }}
              >
                <img
                  src={
                    selectedBook?.cover
                      ? selectedBook.cover
                      : "https://via.placeholder.com/300x450?text=No+Cover"
                  }
                  alt={selectedBook?.title}
                  style={{
                    width: "60%",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  }}
                />
                <p>
                  <b>Author:</b>{" "}
                  {selectedBook?.author_name?.join(", ") || "Unknown"}
                </p>
                <p>
                  <b>First Published:</b>{" "}
                  {selectedBook?.first_publish_year || "N/A"}
                </p>
                <p>
                  <b>Language:</b>{" "}
                  {selectedBook?.language?.join(", ") || "N/A"}
                </p>
                <p>
                  <b>Edition Count:</b> {selectedBook?.edition_count}
                </p>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
