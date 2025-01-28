const helper = require('./test_helper')

const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')

const Blog = require('../models/blog')
const app = require('../app')

const supertest = require('supertest')
const api = supertest(app)

test('all blogs are being shown', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initalBlogs.length)
})

test('blogs have id but not _id and __v', async () => {
  const blogsInDb = await helper.blogsInDb()

  assert(!blogsInDb.some(blog =>
    blog._id !== undefined
    ||
    blog.__v !== undefined
    ||
    blog.id === undefined
  ))
})

test('can create valid blog', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const validBlog = {
    title: 'How to make a good toast',
    author: 'Daniel',
    url: 'http://toast.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(validBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.deepEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  assert(blogsAtEnd.some(blog => blog.title === 'How to make a good toast'))
})

test('blog without title cannot be create', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogWithNoTitle = {
    author: 'epic gamer',
    url: 'https://epicgaming.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(blogWithNoTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('created blog with no likes has default of 0 likes', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogWithNoLikes = {
    title: '600pp easy tutorial for beginners',
    author: 'My Angel Aerora',
    url: 'https://epicgaming.ppy.sh'
  }

  await api
    .post('/api/blogs/')
    .send(blogWithNoLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  assert(blogsAtEnd.some(blog => blog.title === '600pp easy tutorial for beginners' && blog.likes === 0))
})

test('delete post by id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  assert(!blogsAtEnd.some(blog => blog.title === blogToDelete.title))
})

test('can update post by id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = { id: blogsAtStart[0].id, likes: blogsAtStart[0].likes+1 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert(blogsAtEnd.some(blog =>
    blog.title === blogsAtStart[0].title
    &&
    blog.likes === blogsAtStart[0].likes + 1
  ))
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = await helper.initalBlogs
  for (let blog of blogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

after(async () => {
  await mongoose.connection.close()
})