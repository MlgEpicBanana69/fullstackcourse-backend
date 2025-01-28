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