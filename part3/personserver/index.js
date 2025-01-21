require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const { MongoCryptCreateEncryptedCollectionError } = require('mongodb')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.use(morgan((tokens, request, response) => {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens['response-time'](request, response), 'ms',
        tokens.method(request, response) === "POST" ? JSON.stringify(request.body) : ""
    ].join(' ')
}))

app.get('/info', (request, response) => {
    Person.find({}).then(people => {
        response.send(/*html*/`
            <div>
                <h3>Phonebook has info on ${people.length} people</h3>
                <h2>${new Date()}</h2>
            </div>
        `)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            person ? response.json(person) : response.status(404).end()
        })
        .catch(error => {next(error)})
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const newPerson = Person({
        "name": body.name,
        "number": body.number,
    })

    newPerson.save().then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    switch (error.name) {
        case 'CastError':
            return response.status(400).send({ name: error.name, message: 'malformatted id' })
        case 'ValidationError':
            return response.status(400).send({ name: error.name, message: error.message})
    }

    next(error)
  }

  // this has to be the last loaded middleware, also all the routes should be registered before this!
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})