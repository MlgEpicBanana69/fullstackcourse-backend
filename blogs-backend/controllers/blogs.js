const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogsInDb = await Blog
    .find({})
    .populate('user', { username: 1, id: 1 })
  response.json(blogsInDb)
})

blogsRouter.post('/', async (request, response) => {
  const creatorUser = await User.findOne({})

  const blogObject = new Blog({
    ...request.body,
    user: creatorUser._id
  })
  const savedBlog = await blogObject.save()
  creatorUser.blogs = creatorUser.blogs.concat(savedBlog.id)
  await creatorUser.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const deletedNote = await Blog.findOneAndDelete({ _id: id })

  if (deletedNote) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
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