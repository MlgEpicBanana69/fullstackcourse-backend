require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

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

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            person ? response.json(person) : response.status(404).end()
        })
        .catch(error => {
            console.log("Error in get by id :>>", error);
            response.status(400).end()
        })
})

app.post('/api/persons', (request, response) => {
    const phoneNumberRe = /([0-9]){3}-([0-9]){7}/
    const body = request.body

    /* Legacy code
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
    */

    const newPerson = Person({
        "name": body.name,
        "number": body.number,
    })

    /* Legacy code
    if (persons.find(person => person.name === newPerson.name)) {
        response.status(409).json({error: 'name must be unique'})
        return
    }
    */

    newPerson.save().then(result => {
        response.json(result)
    })
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