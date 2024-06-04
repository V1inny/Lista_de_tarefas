const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Importa o módulo path

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [];
let currentId = 1;  // Contador global para ID único

// API
// Endpoint para obter todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Endpoint para criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { description, isCompleted } = req.body;
  const newTask = { id: currentId++, description, isCompleted: isCompleted || false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Endpoint para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id != id);
  
    res.json("Tarefa excluida");
});

// Endpoint para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
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

// Servir a página 'index.html' quando a raiz for acessada
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento básico de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(PORT, () => {
  console.log(`Servidor Funcionando  http://localhost:${PORT}`);
});
