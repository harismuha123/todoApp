// setup

var express = require("express");
var app = express(); // create our app w/ express
var mongoose = require("mongoose"); // mongoose for mongodb
var morgan = require("morgan"); // log requests to the console
var bodyParser = require("body-parser"); // pull information from HTML POST
var methodOverride = require("method-override"); // simulate DELETE and PUT

// configuration

mongoose.connect(
    "mongodb://127.0.0.1:27017/todo",
    { useNewUrlParser: true }
);

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());

// define model
var Todo = mongoose.model("Todo", {
    text: String
});

// routes

// fetch all todos and return them as json
app.get("/api/todos", function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            res.send(err);
        }
        res.json(todos);
    });
});

// create todo and send back all todos after creation
app.post("/api/todos", function(req, res) {
    Todo.create(
        {
            text: req.body.text
        },
        function(err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }
                res.json(todos);
            });
        }
    );
});

// update todo and send back all todos after update
app.post("/api/todos/:todo_id", function(req, res) {
    Todo.findOneAndUpdate(
        {
            _id: req.params.todo_id
        },
        {
            $set: {
                text: req.body.text
            }
        },
        function(err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }
                res.json(todos);
            });
        }
    );
});

// delete todo by id and return all remaining todos
app.delete("/api/todos/:todo_id", function(req, res) {
    Todo.deleteOne(
        {
            _id: req.params.todo_id
        },
        function(err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }

                res.json(todos);
            });
        }
    );
});

// application ------------------
app.get("/", function(req, res) {
    res.sendFile("./public/index.html"); //load the single view file
});

// listen
app.listen(8080);
console.log("App is live on http://localhost:8080!");
