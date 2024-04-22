import { useState, useEffect, useRef } from "react";
import "./index.css";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ message: null, error: null });
  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem("BloglistLoggedInUser");
    if (loggedInJSON) {
      const user = JSON.parse(loggedInJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (loginObj) => {
    try {
      const user = await loginService.login(loginObj);
      window.localStorage.setItem("BloglistLoggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setMessage({ message: "Login Successful", error: null });
      setTimeout(() => {
        setMessage({ message: null, error: null });
      }, 5000);
    } catch (error) {
      console.error(error);
      setMessage({ message: null, error: "Invalid Credentials" });
      setTimeout(() => {
        setMessage({ message: null, error: null });
      }, 5000);
    }
  };

  const addNewBlog = async (blogObj) => {
    try {
      const res = await blogService.createBlog(blogObj);

      newBlogFormRef.current.toggleVisibility();

      setBlogs(blogs.concat(res));

      setMessage({ message: "new blog added", error: null });
      setTimeout(() => {
        setMessage({ message: null, error: null });
      }, 5000);
    } catch (error) {
      console.error(error);
      setMessage({ message: null, error: "new blog couldn't be created" });
      setTimeout(() => {
        setMessage({ message: null, error: null });
      }, 5000);
    }
  };

  const likeABlog = async (updatedBlog, id) => {
    try {
      const res = await blogService.likeBlog(updatedBlog, id);
      const updatedBlogList = blogs.map((blog) => {
        if (blog.id === res.id) {
          return res;
        }
        return blog;
      });
      setBlogs(updatedBlogList);
    } catch (error) {
      console.error(error);
      setMessage({ message: null, error: "couldn't like blog" });
      setTimeout(() => {
        setMessage({ message: null, error: null });
      }, 5000);
    }
  };

  const removeABlog = async (id) => {
    try {
      await blogService.removeBlog(id);
      const updatedBlogList = blogs.filter((blog) => blog.id !== id);
      setBlogs(updatedBlogList);
    } catch (error) {
      console.error(error);
      setMessage({ message: null, error: "couldn't remove blog" });
      setTimeout(() => {
        setMessage({ message: null, error: null });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("BloglistLoggedInUser");
    setUser(null);
    setMessage({ message: "Logout Successful", error: null });
    setTimeout(() => {
      setMessage({ message: null, error: null });
    }, 5000);
  };

  return (
    <div>
      <Notification messageObj={message} />
      {!user ? (
        <Togglable buttonLabel="Login">
          <LoginForm login={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} is logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <h2>blogs</h2>
          <Togglable buttonLabel="Create Note" ref={newBlogFormRef}>
            <NewBlogForm create={addNewBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                like={likeABlog}
                remove={removeABlog}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
