import { useState } from "react";

const NewBlogForm = ({ create }) => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newBlogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };

    create(newBlogObject);

    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };
  return (
    <form onSubmit={handleSubmit}>
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
  );
};

export default NewBlogForm;
