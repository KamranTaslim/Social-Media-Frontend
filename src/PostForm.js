import React, { useState, useContext } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PostsContext } from "./Context/PostsContext";

const PostForm = () => {
  const [postContent, setPostContent] = useState("");
  const { addPost } = useContext(PostsContext);

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (postContent.trim() === "") return;

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post",
        { content: postContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      addPost(response.data); // Ensure the response data structure matches what FeedList expects
      setPostContent("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to create post.");
    }
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit} className="post-form">
        <Form.Group controlId="postContent">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write something..."
            value={postContent}
            onChange={handleInputChange}
            className="mb-3"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default PostForm;
