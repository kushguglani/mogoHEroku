const mocha = require('mocha');
const expect = require('expect');
const request  = require('supertest');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let texts = [
    {
    _id:new ObjectID(),
    text:'First todo'
    },
    {
        _id:new ObjectID(),
        text:'second todo'
    }
];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(texts).then(()=> done());
    });
})

describe('Post /saveTodo',()=>{
    it('should save todo in database',(done)=>{
        var text = "test todo text";
        request(app)
        .post('/saveTodo')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            // verify that it is saved in db or not
            Todo.find().then((todo)=>{
                expect(todo.length).toBe(3);
                expect(todo[2].text).toBe(text);
                done();
            })
            .catch((e)=> done(e));
        });
    });


it('should not saved in db validation empty text',(done)=>{
    request(app)
    .post('/saveTodo')
    .send()
    .expect(400)
    .expect((res)=>{
        expect(res.body.text).toBe();
    })
    .end((err,res)=>{
        if(err)
            return done(err);
        Todo.find().then((todos)=>{
            expect(todos.length).toBe(2);
            done();
        })
        .catch((e)=> done(e));
    });
})

});

describe("Get /todos",()=>{
    it('should find all the todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

// describe('Get /todo/:id',()=>{
//     it('it should find by id through url',(done)=>{
//         request(app)
//         .get(`/todo/${texts[0]._id.toHexString()}`)
//         .expect((kg)=>{
//             console.log(kg.body);
//             console.log(texts[0]._id.toHexString());
//             expect(kg.body.res._id.toHexString()).toBe(texts[0]._id);
//         })
//         .end(done);
//         });
// });