const { ReturnDocument } = require('mongodb');
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log("Connecting to", url);
mongoose.connect(url)
    .then(result => {
        console.log("Succesfully connected to MongoDB");
    })
    .catch(error => {
        console.log("Failed to connect to MongoDB", error.message);
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: {
        type: String,
        required: true,
        match: /([0-9]){3}-([0-9]){7}/
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)