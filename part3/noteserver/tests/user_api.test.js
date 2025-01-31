const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const User = require('../models/user')

describe('when there are multiple users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash1 = await bcrypt.hash('sekret', 10)
    const user1 = new User({ username: 'root', passwordHash: passwordHash1 })

    const passwordHash2 = await bcrypt.hash('sod', 10)
    const user2 = new User({ username: 'mualani', passwordHash: passwordHash2 })

    await Promise.all([user1, user2].map(user => user.save()))
  })

  test.only('server correctly responds all users', async () => {
    const usersInDb = await helper.usersInDb()

    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, usersInDb.length)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    assert(usersAtEnd.some(user => user.username === newUser.username))
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWithTakenName = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUserWithTakenName)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})