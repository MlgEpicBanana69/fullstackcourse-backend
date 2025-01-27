const Blog = require('../models/blog')

const initalBlogs = [
  {
    title: 'How to epicly game',
    author: 'epic gamer',
    url: 'https://www.gaming.com',
    like: 69
  },
  {
    title: 'Vegans should go to hell',
    author: 'Jod',
    url: 'https://www.fuck-you-daniel.com',
    likes: 4
  },
  {
    title: 'Michlol and its consequences were a disaster on the human race',
    author: 'Ktzinim',
    url: 'https://www.hanphatzot.co.il',
    likes: 424
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = { initalBlogs, blogsInDb }