const usersRouter = require('express').Router()

const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, url: 1, author: 1, id: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // password requirement validation
  const passwordValidator = password ? password.length >= 3 : false
  if (!passwordValidator) {
    response.status(400).json({ error: 'User validation failed: password' })
    return
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await newUser.save({ runValidators: true })
  response.status(201).json(savedUser)
})

module.exports = usersRouter