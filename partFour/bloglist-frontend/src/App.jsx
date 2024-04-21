import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ message: null, error: null });

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

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with...", username, password);
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("BloglistLoggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
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

  const addNewBlog = async (event) => {
    event.preventDefault();
    console.log("adding new blog...");
    try {
      const newBlogObject = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      };
      const res = await blogService.createBlog(newBlogObject);
      setBlogs(blogs.concat(res));
      setNewBlogTitle("");
      setNewBlogAuthor("");
      setNewBlogUrl("");
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

  const handleLogout = () => {
    window.localStorage.removeItem("BloglistLoggedInUser");
    setUser(null);
    setMessage({ message: "Logout Successful", error: null });
    setTimeout(() => {
      setMessage({ message: null, error: null });
    }, 5000);
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            value={password}
            type="password"
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    );
  };

  return (
    <div>
      <Notification messageObj={message} />
      {!user ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} is logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <h2>blogs</h2>
          <form onSubmit={addNewBlog}>
            <div>
              Title
              <input
                type="text"
                value={newBlogTitle}
                name="NewBlogTitle"
                onChange={({ target }) => setNewBlogTitle(target.value)}
              />
            </div>
            <div>
              Author
              <input
                type="text"
                value={newBlogAuthor}
                name="NewBlogAuthor"
                onChange={({ target }) => setNewBlogAuthor(target.value)}
              />
            </div>
            <div>
              Url
              <input
                type="text"
                value={newBlogUrl}
                name="NewBlogUrl"
                onChange={({ target }) => setNewBlogUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
