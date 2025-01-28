const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogsInDb = await Blog.find({})
  response.json(blogsInDb)
})

blogsRouter.post('/', async (request, response, next) => {
  const blogObject = new Blog(request.body)

  const savedBlog = await blogObject.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  const deletedNote = await Blog.findOneAndDelete({ _id: id })

  if (deletedNote) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const submittedBlog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, { ...submittedBlog }, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(400).end()
  }
})

module.exports = blogsRouter