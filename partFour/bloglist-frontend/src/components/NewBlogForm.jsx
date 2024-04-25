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
          id="titleTest"
          type="text"
          value={newBlogTitle}
          name="NewBlogTitle"
          onChange={({ target }) => setNewBlogTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          id="authorTest"
          type="text"
          value={newBlogAuthor}
          name="NewBlogAuthor"
          onChange={({ target }) => setNewBlogAuthor(target.value)}
        />
      </div>
      <div>
        Url
        <input
          id="urlTest"
          type="text"
          value={newBlogUrl}
          name="NewBlogUrl"
          onChange={({ target }) => setNewBlogUrl(target.value)}
        />
      </div>
      <button type="submit" id="createTest">
        create
      </button>
    </form>
  );
};

export default NewBlogForm;
