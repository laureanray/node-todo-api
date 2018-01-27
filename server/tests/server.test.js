const expect = require('expect');
const request = require('supertest');

//local
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done()); 
});

describe('Post /todos', () =>{
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

             Todo.find().then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
             }).catch((e) => {
                 done(e);
             });
         })
    });
});

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
             expect(todos.length).toBe(0); // since it should not add
             done();
         }).catch((e) => {
            done(e);
         });
     })
});