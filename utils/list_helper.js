const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const getSum = () => {
    let sum = 0;
    blogs.forEach((blog) => {
      sum = sum + blog.likes;
    });
    return sum;
  };

  return blogs.length === 0 ? 0 : blogs.length === 1 ? blogs[0].likes : getSum();
};

module.exports = { dummy, totalLikes };
