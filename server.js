const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');
const {mongoose} = require('./db/mongoose.js');

const{ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

// console.log(process.env);

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

app.post('/saveTodo',(req,res)=>{
    console.log(req.body.text);

    let newTodo = new Todo({
        text:req.body.text
    });
    // console.log(newTodo);
    newTodo.save().then((doc)=>{
    console.log(doc);
    console.log("kush");
    res.send(doc);
    },(e)=>{
    console.log(e);
        res.status(400).send(e);
    })
});
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
       res.send({todos});
    });
}); 

app.get('/todo/:id',(request,response)=>{
    let id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }
    Todo.findById(id).then((res)=>{
        if(!res){
            return response.status(404).send();
        }
        response.send(res);
    }).catch((e)=>{
       return response.status(400).send();
    })
});

app.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
});