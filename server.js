require('./config/config.js');
const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');
const { mongoose } = require('./db/mongoose.js');
const {authenticate} = require('./middleware/authenticate.js');

const { ObjectID } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');


// console.log(process.env);

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.post('/saveTodo', authenticate, (req, res) => {
    console.log(req.body.text);

    let newTodo = new Todo({
        text: req.body.text,
        _creator:req.user._id
    });
    // console.log(newTodo);
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        console.log(e);
        res.status(400).send(e);
    })
});
app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator:req.user._id
    }).then((todos) => {
        res.send({ todos });
    });
});

app.get('/todo/:id', authenticate, (request, response) => {
    let id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }
    console.log(request.user._id);
    Todo.findOne({
        _id:id,
        '_creator':request.user._id}).then((res) => {
        console.log(res);
        if (!res) {
            return response.status(404).send();
        }
        response.send(res);
    }).catch((e) => {
        return response.status(400).send();
    })
});

app.get('/deleteTodo/:id', authenticate,(req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    console.log(req.user._id);
    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((doc) => {
        console.log(doc);
        if (!doc) {
            return res.status(404).send();
        }
        res.status(200).send("deleted");
    })
        .catch((e) => {
            res.status(400).send();
        });
});

app.patch('/todo/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completedAt = null;
        body.completed = false;
    }
    console.log(body);
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo)
            return res.status(404).send();
        res.status(200).send(todo);
    })
        .catch((e) => {
            res.status(400).send();
        });
});

// save user in db

app.post('/saveUser', (request, response) => {
    let body = _.pick(request.body, ['email', 'password']);
    let newUser = new User(body);
    // console.log(newUser.generateAuthToken());
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    })
    .then((token) => {
        response.header('x-auth',token).send(newUser);
    })
    .catch((e) => {
        response.status(400).send(e);
    });
});


app.post('/user/me',authenticate,(request,response)=>{
    response.send(request.user);
});

app.post('/user/login',(request,response)=>{
    let body = _.pick(request.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            response.header('x-auth',token).send(user);
        });
    })
    .catch((e)=>{ response.status(400).send(e);})
})

app.delete('/user/me/token',authenticate,(req,res)=>{
    console.log(req.user);
    console.log(req.token);
    req.user.deleteToken(req.token).then(()=>
    {
        res.status('200').send("Log Out");
    },()=>{
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
module.exports = { app };