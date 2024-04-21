const dummy = (blogArray) => {
  if (blogArray) return 1;
  return 0;
};

const totalLikes = (blogArray) => {
  if (blogArray.length === 0) return 0;
  if (blogArray.length === 1) return blogArray[0].likes;
  let total = 0;
  blogArray.forEach((blog) => {
    total = total + blog.likes;
  });
  return total;
};

const favoriteBlog = (blogArray) => {
  const maxLikes = blogArray.reduce((acc, curr) => {
    if (curr.likes > acc) {
      return curr.likes;
    }
    return acc;
  }, 0);
  const favBlog = blogArray.find((blog) => {
    return blog.likes === maxLikes;
  });

  const updatedFavBlog = {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  };
  return updatedFavBlog;
};

const mostBlogs = (blogArray) => {
  //   const mostBlogsAuthor = Object.groupBy(blogArray, ({ author }) => {
  //     console.log("ahhhh", author);
  //     return author;
  //   });
  //   console.log("hello", mostBlogsAuthor);
  let bestAuthorArray = [];
  blogArray.forEach((currentBlog) => {
    const hardWorkingAuthor = blogArray.filter(
      (blog) => blog.author === currentBlog.author
    );
    return bestAuthorArray.push({
      author: currentBlog.author,
      blogs: hardWorkingAuthor.length,
    });
  });
  const mostBlogsAuthor = bestAuthorArray.reduce((acc, curr, index) => {
    if (curr.blogs > acc) {
      return index;
    }
    return acc;
  }, 0);
  return bestAuthorArray[mostBlogsAuthor];
};

const mostLikes = (blogArray) => {
  let mostLikesAuthor = [];
  blogArray.forEach((currentBlog) => {
    if (
      mostLikesAuthor.find((current) => current.author === currentBlog.author)
    ) {
      return;
    }
    const allAuthorBlogs = blogArray.filter(
      (blog) => blog.author === currentBlog.author
    );
    const allLikes = allAuthorBlogs.reduce((acc, curr) => {
      return acc + curr.likes;
    }, 0);
    return mostLikesAuthor.push({
      author: currentBlog.author,
      likes: allLikes,
    });
  });
  const most_likes = Math.max(
    ...mostLikesAuthor.map((current) => current.likes)
  );
  return mostLikesAuthor.find((author) => author.likes === most_likes);
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
