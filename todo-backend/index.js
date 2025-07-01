// todo-backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

let todos = []; // Pour stocker les tâches en mémoire

// Routes
//récupération des taches
app.get('/todos', (req, res) => {
  res.json(todos);
}); 

//ajout d'une tache
app.post('/todos', (req, res) => {
  const { title } = req.body;
  const newTodo = { id: Date.now(), title, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// supprimer une tache
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id != id);
  res.status(204).send();
});

// modifier une tache
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todos.find(todo => todo.id == id);
  if (!todo) {
    return res.status(404).json({ message: 'Tâche non trouvée' });
  }

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});



app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});