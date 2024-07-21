import React, { useState, useEffect } from "react";
import { ListGroup, Card } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

const FeedList = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const jwtToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      if (!jwtToken) {
        console.error("No token found, user is not authenticated.");
        return;
      }

      const cachedPosts = JSON.parse(localStorage.getItem("cachedPosts"));
      const cachedTimestamp = localStorage.getItem("cachedTimestamp");

      const currentTime = new Date().getTime();
      const cacheExpirationTime = cachedTimestamp
        ? parseInt(cachedTimestamp) + 10 * 60 * 1000 // 10 minutes
        : 0;

      if (cachedPosts && currentTime < cacheExpirationTime) {
        setPosts(cachedPosts);
        const initialLikedPosts = cachedPosts
          .filter((post) => post.likes && post.likes.includes("currentUserId"))
          .map((post) => post._id);
        setLikedPosts(initialLikedPosts);
      } else {
        try {
          const response = await axios.get("http://localhost:5000/api/post", {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          setPosts(response.data);
          const initialLikedPosts = response.data
            .filter((post) => post.likes.includes("currentUserId"))
            .map((post) => post._id);
          setLikedPosts(initialLikedPosts);

          localStorage.setItem("cachedPosts", JSON.stringify(response.data));
          localStorage.setItem(
            "cachedTimestamp",
            new Date().getTime().toString()
          );
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    fetchPosts();
  }, [jwtToken]);

  const handleLike = async (postId) => {
    const isLiked = likedPosts.includes(postId);

    try {
      if (isLiked) {
        await axios.delete(`http://localhost:5000/api/likes`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          data: { postId },
        });
        setLikedPosts(likedPosts.filter((id) => id !== postId));
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, likes: post.likes - 1 } : post
          )
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/likes`,
          { postId },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setLikedPosts([...likedPosts, postId]);
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      }
    } catch (error) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} post:`, error);
    }
  };

  return (
    <ListGroup>
      {posts.map((post) => (
        <ListGroup.Item key={post._id}>
          <Card>
            <Card.Body>
              <Card.Text>{post.content}</Card.Text>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {post.userId && post.userId.email ? (
                    <small className="text-muted">
                      Posted by {post.userId.email}
                    </small>
                  ) : (
                    <small className="text-muted">Posted by Unknown</small>
                  )}
                </div>
                <div>
                  <button
                    className={`btn btn-link ${
                      likedPosts.includes(post._id)
                        ? "text-primary"
                        : "text-dark"
                    }`}
                    onClick={() => handleLike(post._id)}
                  >
                    <i
                      className={`fa-lg ${
                        likedPosts.includes(post._id)
                          ? "fas fa-thumbs-up"
                          : "far fa-thumbs-up"
                      }`}
                    ></i>
                  </button>
                  <span className="ml-2">{post.likes}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default FeedList;
