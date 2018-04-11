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

app.post('/saveTodo', (req, res) => {
    console.log(req.body.text);

    let newTodo = new Todo({
        text: req.body.text
    });
    // console.log(newTodo);
    newTodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        console.log(e);
        res.status(400).send(e);
    })
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    });
});

app.get('/todo/:id', (request, response) => {
    let id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }
    Todo.findById(id).then((res) => {
        if (!res) {
            return response.status(404).send();
        }
        response.send(res);
    }).catch((e) => {
        return response.status(400).send();
    })
});

app.get('/deleteTodo/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(404).send();
    Todo.findByIdAndRemove(id).then((doc) => {
        if (!doc) {
            return res.send(doc);
        }
        res.status(200).send(doc);
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
        response.status(400).send();
    });
});


app.post('/user/me',authenticate,(request,response)=>{
    response.send(request.user);
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
module.exports = { app };