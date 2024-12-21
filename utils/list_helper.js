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
      fav = blog;
      delete fav._id;
      delete fav.url;
      delete fav.__v;

      highest = blog.likes;
    }
  });
  return { ...fav };
};

module.exports = { dummy, totalLikes, favoriteBlog };
