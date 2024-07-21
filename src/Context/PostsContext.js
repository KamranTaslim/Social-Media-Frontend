import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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
        setIsLoaded(true);
      } else {
        try {
          const response = await axios.get("http://localhost:5000/api/post", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPosts(response.data);
          setIsLoaded(true);

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

    if (!isLoaded) {
      fetchPosts();
    }
  }, [isLoaded]);

  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
};

export { PostsProvider, PostsContext };
