const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const tasks = require('./tasks');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy login for token generation
app.post('/api/login', (req, res) => {
  const user = { id: 1, name: 'TestUser' };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected routes
app.get('/api/tasks', authMiddleware, (req, res) => {
  res.json(tasks.getAll());
});

app.post('/api/tasks', authMiddleware, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text is required' });
  const newTask = tasks.add(text);
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const removed = tasks.remove(id);
  if (!removed) return res.status(404).json({ error: 'Task not found' });
  res.status(200).json({ message: 'Task deleted' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
