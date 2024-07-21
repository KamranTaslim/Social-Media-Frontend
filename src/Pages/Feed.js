import React from "react";
import { Container } from "react-bootstrap";

import FeedList from "../FeedList";
import { PostsProvider } from "../Context/PostsContext";
import PostForm from "../PostForm";

const Feed = () => {
  return (
    <PostsProvider>
      <Container>
        <PostForm />
        <FeedList />
      </Container>
    </PostsProvider>
  );
};

export default Feed;
