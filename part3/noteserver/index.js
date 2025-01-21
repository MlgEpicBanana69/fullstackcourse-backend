require('dotenv').config()

const express = require('express')
const cors = require('cors')

const Note = require('./models/note')

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id

    Note.findById(id).then(note => {
        note ? response.json(note) : response.status(404).end()
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))

})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const id = request.params.id

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
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
            return response.status(400).send({ error: 'malformatted id' });
        case 'ValidationError':
            return response.status(400).send({ error: error.message});
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is now running on ${PORT}`);
})