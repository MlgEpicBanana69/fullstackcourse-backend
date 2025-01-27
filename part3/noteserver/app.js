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
const notesRouter = require('./controllers/notes')

// middlewear
const middleware = require('./utils/middlewear')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// use middlewear
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// use routers
app.use('/api/notes', notesRouter)

// handlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app