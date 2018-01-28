const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user');

let id = '6a6c6e0cc424c44c218b3de7';
// let id = '5a6d695c0461a5214be7b94311';

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }
// // Todo.find({
// //     _id: id
// // }).then((todos) => {
// //     console.log(`Todos: ${todos}`);
// // });

// // Todo.findOne({
// //     _id: id
// // }).then((todo) => {
// //     console.log('Todo', todo) 
// // });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found!');
//     }
//     console.log(`Todo by id: ${todo}`);
// }).catch((e) => {
//     console.log(e);
// })

User.findById(id).then((user) => {
    if(!user){
        return console.log("User doesn't exist");
    }
    console.log(`User: ${JSON.stringify(user, undefined, 4)}`);
}).catch((e) => console.log(e));