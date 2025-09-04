import { Card, Typography } from "antd";
import { motion } from "framer-motion";

const { Text, Title } = Typography;

const BookCard = ({ book, onClick }) => {
  const coverId = book.cover_edition_key || book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/olid/${coverId}-M.jpg`
    : "https://via.placeholder.com/120x180?text=No+Cover";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        hoverable
        onClick={onClick}
        style={{
          marginBottom: "16px",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
        styles={{
          body: { padding: "12px", display: "flex", alignItems: "center" },
        }}
      >
        <img
          src={coverUrl}
          alt={book.title}
          style={{
            width: 90,
            height: 130,
            objectFit: "cover",
            borderRadius: "8px",
            marginRight: "16px",
          }}
        />
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0 }}>
            {book.title}
          </Title>
          <Text type="secondary">👤 {book.author_name?.join(", ") || "Unknown"}</Text>
          <br />
          <Text type="secondary">📅 {book.first_publish_year || "N/A"}</Text>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookCard;
