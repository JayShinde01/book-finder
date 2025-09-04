import { Input, Row, Col, Form, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Option } = Select;

const SearchBar = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSearch = (values) => {
    if (!values.query && !values.author && !values.year && !values.language) {
      return; // don't search if all empty
    }
    onSearch(null, values);
  };

  // ✅ Trigger search instantly with debounce
  const handleChange = () => {
    const values = form.getFieldsValue();

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        handleSearch(values);
      }, 500) // wait 500ms after typing
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{
        background: "rgba(255,255,255,0.9)",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="query">
            <Input
              size="large"
              placeholder="Search by Title..."
              prefix={<SearchOutlined />}
              style={{ borderRadius: "8px" }}
              onChange={handleChange}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item name="author">
            <Input
              size="large"
              placeholder="Author"
              style={{ borderRadius: "8px" }}
              onChange={handleChange}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Form.Item name="year">
            <Input
              size="large"
              placeholder="Year"
              type="number"
              style={{ borderRadius: "8px" }}
              onChange={handleChange}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Form.Item name="language">
            <Select
              placeholder="Language"
              size="large"
              style={{ width: "100%", borderRadius: "8px" }}
              onChange={handleChange}
              allowClear
            >
              <Option value="eng">English</Option>
              <Option value="fre">French</Option>
              <Option value="ger">German</Option>
              <Option value="spa">Spanish</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
