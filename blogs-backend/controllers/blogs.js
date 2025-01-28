const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogsInDb = await Blog.find({})
  response.json(blogsInDb)
})

blogsRouter.post('/', async (request, response) => {
  const blogObject = new Blog(request.body)

  const savedBlog = await blogObject.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter