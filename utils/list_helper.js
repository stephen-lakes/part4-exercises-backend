const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  let fav;
  let highest = 0;
  blogs.forEach((blog) => {
    if (blog.likes > highest) {
      fav = { title: blog.title, author: blog.author, likes: blog.likes };

      highest = blog.likes;
    }
  });
  return fav;
};

module.exports = { dummy, totalLikes, favoriteBlog };
