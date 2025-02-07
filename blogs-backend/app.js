// utility
const config = require('./utils/config')
const logger = require('./utils/logger')

// dependencies
const express = require('express')
const mongoose = require('mongoose')

// application
const app = express()
const cors = require('cors')
require('express-async-errors')

// routers
const blogsRouter = require('./controllers/blogs')
const usersRouter  = require('./controllers/users')

// middlewear
const middlewear = require('./utils/middlewear')

mongoose.set('strictQuery', false)

logger.info('Connecting to MongoDB')
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('Failed to connect to mongoDB', error.message)
  })

// use middlewear
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middlewear.requestLogger)

// use routers
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

// handlers
app.use(middlewear.unknownEndpoint)
app.use(middlewear.errorHandler)

module.exports = app