const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const testUser = {
  username: 'testuser',
  password: 'testsecret'
}

const initialUsers = [
  {
    username: 'root',
    password: 'sekret'
  },
  {
    username: 'mualani',
    password: 'sharky',
  },
  {
    username: 'kinich',
    password: 'ahaw'
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb,
  initialUsers, testUser, usersInDb
}