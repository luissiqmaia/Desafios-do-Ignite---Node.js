const express = require("express");
const cors = require("cors");
const { v4, validate } = require("uuid");

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((u) => u.username === username);
  if (!user) return response.status(404).json({ error: "Mensagem de erro" });

  request.username = user;
  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  if (users.some((u) => u.username === username))
    return response.status(400).json({ error: "Mensagem de erro" });

  const user = {
    id: v4(),
    name,
    username,
    todos: [],
  };
  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;

  return response.json(username.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  username.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const {
    params: { id },
    body: { title, deadline },
  } = request;

  const todo = username.todos.find((t) => t.id === id);
  if (!todo) response.status(404).json({ error: "Mensagem de erro" });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const {
    params: { id },
  } = request;

  const todo = username.todos.find((t) => t.id === id);
  if (!todo) return response.status(404).json({ error: "Mensagem de erro" });

  todo.done = true;
  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {
    username,
    params: { id },
  } = request;

  const todoIndex = username.todos.findIndex((t) => t.id === id);
  if (todoIndex < 0)
    return response.status(404).json({ error: "Mensagem de erro" });

  username.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;
