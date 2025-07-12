const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text) {
    const newTask = {
      id: Date.now(),
      text,
      date,
      completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskDate.value = '';
  }
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  filterBtns.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  let filteredTasks = [];
  if (filter === 'all') filteredTasks = tasks;
  else if (filter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
  else if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

  renderTasks(filteredTasks);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(tasksToRender = tasks) {
  taskList.innerHTML = tasksToRender
    .map(
      task => `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-content">
          <span class="task-text">${task.text}</span>
          ${task.date ? `<span class="task-date">${new Date(task.date).toLocaleDateString()}</span>` : ''}
        </div>
        <div class="task-actions">
          <button class="complete-btn" onclick="toggleTask(${task.id})">
            <i class="fas fa-${task.completed ? 'rotate-left' : 'circle-check'}"></i>
          </button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </li>
    `
    )
    .join('');
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});
filterBtns.forEach(btn =>
  btn.addEventListener('click', () => filterTasks(btn.dataset.filter))
);

renderTasks();
