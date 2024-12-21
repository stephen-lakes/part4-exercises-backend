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

module.exports = { dummy, totalLikes, favoriteBlog };
