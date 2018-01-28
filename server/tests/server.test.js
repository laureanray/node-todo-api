const expect = require('expect');
const request = require('supertest');

//local
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    text: 'First test todo'
}, {
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