const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user');

// Todo.remove
Todo.remove({}).then((result) => {
    console.log(result);
});