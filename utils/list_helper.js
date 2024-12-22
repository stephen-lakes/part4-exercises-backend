const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return 0;

  return blogs.reduce(
    (fav, blog) =>
      blog.likes > (fav?.likes || 0)
        ? { title: blog.title, author: blog.author, likes: blog.likes }
        : fav,
    null
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0;

  let authorBlogCount = {};
  blogs.forEach((blog) => {
    if (authorBlogCount[blog.author]) {
      authorBlogCount[blog.author].count += 1;
    } else {
      authorBlogCount[blog.author] = { count: 1 };
    }
  });

  let topAuthor = Object.keys(authorBlogCount).reduce((acc, b) =>
    authorBlogCount[acc] > authorBlogCount[b] ? acc : b
  );

  return { author: topAuthor, blogs: authorBlogCount[topAuthor].count };
};

const mostLikes = () => {};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
