const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
//local
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done()); 
});

describe('Post /todos', () =>{
    // post request handler
    it('Should create a todo', (done) => {
        var text = 'Test todo text';
        
        request(app)
         .post('/todos')
         .send({text})
         .expect(200)
         .expect((res) => {
            expect(res.body.text).toBe(text);
         })
         .end((err, res) => {
             if(err){
                 return done(err);
             }

             Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
             }).catch((e) => {
                 done(e);
             });
         })
    });
    // This is for the bad request handler
    it('Should not create a todo with bad request', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                
                expect(todos.length).toBe(2); // since it should not add
                done();
            }).catch((e) => {
                done(e);
            });
        })
    });
});


describe('GET /todos', () => {
    // get handler
    it('Should get all todos', (done) => {
        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
              expect(res.body.todos.length).toBe(2);
          })
          .end(done); 
    });
});

describe('GET /todos:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(todos[0].text);
          })
          .end(done);
    });

    it('Should return a 404 if todo not found', (done) => {
        var hexid = new ObjectID().toHexString();
        request(app)
       .get(`/todos/${hexid}`)
       .expect(404)
       .end(done);
    });        
 
    it('Should return a 404 for non object ids', (done) => {
        request(app)
         .get(`/todos/123`)
         .expect(404)
         .end(done);
    });
});  

describe('DELETE /todos/:id', () => {
    it('Should remove a todo',(done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
         .delete(`/todos/${hexId}`)
         .expect(200)
         .expect((res) => {
             expect(res.body.todo._id).toBe(hexId);
         }).end((err,res) => {
            if(err){
                return console.log(err);
            }
            Todo.findById(hexId).then((res) => {
                expect(res).toNotExist();
                done();
            }).catch((e) => console.log(e));
         })
    });

    it('Should return a 404 if todo not found', (done) => {
        var hexid = new ObjectID().toHexString();
        request(app)
       .delete(`/todos/${hexid}`)
       .expect(404)
       .end(done);
    });

    it('Should return 404 if object is invalid', (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});
