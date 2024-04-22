import { useState } from "react";

const Blog = ({ blog, like, user, remove }) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const likeABlog = () => {
    const newLikeCount = blog.likes + 1;
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: newLikeCount,
    };
    like(updatedBlog, blog.id);
  };

  const deleteBlog = () => {
    window.confirm("Confirm that you want to delete this blog");
    remove(blog.id);
  };

  return (
    // <div className="blogStyle">
    <div>
      <div style={hideWhenVisible}>
        {blog.title} <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={toggleVisibility}>hide</button>
        <div>Author: {blog.author}</div>
        <div>{blog.url}</div>
        <div>
          Likes: {blog.likes} <button onClick={likeABlog}>like</button>
        </div>
        <div>Added By: {blog.user.name}</div>
        {user.username === blog.user.username && (
          <button onClick={deleteBlog}>delete blog</button>
        )}
      </div>
    </div>
  );
};

export default Blog;
