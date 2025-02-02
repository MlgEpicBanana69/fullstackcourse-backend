const helper = require('./test_helper')
const app = require('../app')
const supertest = require('supertest')
const { beforeEach, test, describe } = require('node:test')
const assert = require('assert')

const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const User = require('../models/user')
const api = supertest(app)

describe('when there are many users initially', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    // initialize users
    for (const u of helper.initialUsers) {
      const passwordHash = await bcrypt.hash(u.password, 10)
      const user = new User({ passwordHash, ...u })
      await user.save()
    }
  })

  test('fresh user can be added', async () => {
    const usersAtStart = await helper.usersInDb()
    const freshUser = {
      username: 'traveler',
      name: 'Lumine',
      password: 'paimon'
    }

    await api
      .post('/api/users')
      .send(freshUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length+1)
    assert(usersAtEnd.some(user => user.username === 'traveler'))
  })

  test('user without username cannot be added', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithoutUsername = {
      name: 'Lumine',
      password: 'paimon'
    }

    const response = await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(response.body.error.includes('User validation failed'))
  })

  test('user without password cannot be added', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithoutPassword = {
      username: 'traveler',
      name: 'Lumine',
    }

    const response = await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(response.body.error.includes('User validation failed'))
  })

  test('user with non unique username cannot be added', async () => {
    const usersAtStart = await helper.usersInDb()
    const userWithoutUniqueUsername = {
      username: 'mualani',
      name: 'Already Exists',
      password: 'hot springs'
    }

    const response = await api
      .post('/api/users')
      .send(userWithoutUniqueUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(response.body.error.includes('username already taken'))
  })

  describe('invalid username does not pass validation', () => {
    test('username too short', async () => {
      const usersAtStart = await helper.usersInDb()
      const userWithShortUsername = {
        username: 'tr', // Too short
        name: 'Lumine',
        password: 'paimon'
      }

      const response = await api
        .post('/api/users')
        .send(userWithShortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      assert(response.body.error.includes('User validation failed: username'))
    })
  })

  describe('invalid password does not pass validation', () => {
    test('password too short', async () => {
      const usersAtStart = await helper.usersInDb()
      const userWithShortPassword = {
        username: 'traveler',
        name: 'Lumine',
        password: 'pa' // too short
      }

      const response = await api
        .post('/api/users')
        .send(userWithShortPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      assert(response.body.error.includes('User validation failed: password'))
    })
  })
})