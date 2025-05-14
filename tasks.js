let tasks = [];
let idCounter = 1;

function getAll() {
  return tasks;
}

function add(text) {
  const task = { id: idCounter++, text };
  tasks.push(task);
  return task;
}

function remove(id) {
  const index = tasks.findIndex(t => t.id == id);
  if (index !== -1) {
    return tasks.splice(index, 1)[0];
  }
  return null;
}

module.exports = { getAll, add, remove };
