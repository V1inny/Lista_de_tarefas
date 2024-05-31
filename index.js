//API
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let tasks = [];
let currentId = 1;  // Contador global para ID único

// Endpoint para obter todas as tarefas
app.get('/tasks', (req, res) => {  // Modifiquei de '/script' para '/tasks' para ser mais descritivo
  res.json(tasks);
});

// Endpoint para criar uma nova tarefa
app.post('/tasks', (req, res) => {  // Modifiquei de '/script' para '/tasks'
  const { description, isCompleted } = req.body;
  const newTask = { id: currentId++, description, isCompleted: isCompleted || false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Endpoint para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {  // Modifiquei de '/script/:id' para '/tasks/:id'
  const { id } = req.params;
  tasks = tasks.filter(task => task.id != id);
  res.status(204).send();
});

// Endpoint para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {  // Modifiquei de '/script/:id' para '/tasks/:id'
  const { id } = req.params;
  const { description, isCompleted } = req.body;
  const taskIndex = tasks.findIndex(task => task.id == id);
  if (taskIndex > -1) {
    tasks[taskIndex] = { id: Number(id), description, isCompleted };
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send();
  }
});

// Tratamento básico de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(PORT, () => {
  console.log(`Servidor Funcionando  http://localhost:${PORT}`);
});
