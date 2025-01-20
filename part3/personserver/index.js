const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.use(morgan((tokens, request, response) => {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens['response-time'](request, response), 'ms',
        tokens.method(request, response) === "POST" ? JSON.stringify(request.body) : ""
    ].join(' ')
}))

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const generateId = () => String(Math.floor(Math.random() * 100000))

app.get('/info', (request, response) => {
    response.send(/*html*/`
        <div>
            <h3>Phonebook has info on ${persons.length} people</h3>
            <h2>${new Date()}</h2>
        </div>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const match = persons.find(person => person.id === id)

    if (match) {
        response.json(match)
    }
    else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const phoneNumberRe = /([0-9]){3}-([0-9]){7}/
    const body = request.body

    if (
        body.name == null || body.number == null
        ||
        phoneNumberRe.exec(body.number) == null
        ||
        body.name.length === 0
    ) {
        response.status(400).json({error: 'Bad request'})
        return
    }

    const newPerson = {
        "id": generateId(),
        "name": body.name,
        "number": body.number,
    }

    if (persons.find(person => person.name === newPerson.name)) {
        response.status(409).json({error: 'name must be unique'})
        return
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const match = persons.find(person => person.id === id)

    if (match) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }
    else {
        response.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})