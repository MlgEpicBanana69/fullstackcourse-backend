const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, currBlog) => total + currBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favBlog, currBlog) => currBlog.likes > favBlog.likes ? currBlog : favBlog, blogs[0])
}

const mostBlogs = (blogs) => {
  const authorsByBlogs = lodash.countBy(blogs, 'author')
  const topAuthor = Object.keys(authorsByBlogs).reduce(
    (topBlogger, currBlogger) => authorsByBlogs[topBlogger] > authorsByBlogs[currBlogger] ? topBlogger : currBlogger
  )

  const result = { author: topAuthor, blogs: authorsByBlogs[topAuthor] }
  return result
}

const mostLikes = (blogs) => {
  const likesByAuthors = lodash.groupBy(blogs, (blog) => blog.author)
  const summedLikesByAuthors = Object.keys(likesByAuthors).map(key => ({ author: key, likes: lodash.sumBy(likesByAuthors[key], 'likes') }))

  return lodash.maxBy(summedLikesByAuthors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}