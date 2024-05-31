const inputElement = document.querySelector(".new-task-input");
const addTaskButton = document.querySelector(".new-task-button");
const tasksContainer = document.querySelector(".tasks-container");

const API_URL = 'http://localhost:3000/tasks';

const validateInput = () => inputElement.value.trim().length > 0;

const fetchTasks = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

const createTask = async (task) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return response.json();
};

const deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};

const updateTask = async (id, task) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return response.json();
};

const handleAddTask = async () => {
  const inputIsValid = validateInput();

  if (!inputIsValid) {
    return inputElement.classList.add("error");
  }

  const newTask = { description: inputElement.value, isCompleted: false };
  const createdTask = await createTask(newTask);

  addTaskToDOM(createdTask);
  inputElement.value = "";
};

const handleClick = async (taskContent, taskId) => {
  const updatedTask = { description: taskContent.innerText, isCompleted: !taskContent.classList.contains("completed") };
  await updateTask(taskId, updatedTask);
  taskContent.classList.toggle("completed");
};

const handleDeletClick = async (taskItemContainer, taskId) => {
  await deleteTask(taskId);
  taskItemContainer.remove();
};

const handleCheckboxChange = async (taskContent, checkbox, taskId) => {
  const updatedTask = { description: taskContent.innerText, isCompleted: checkbox.checked };
  await updateTask(taskId, updatedTask);
  taskContent.classList.toggle("completed", checkbox.checked);
};

const addTaskToDOM = (task) => {
  const taskItemContainer = document.createElement("div");
  taskItemContainer.classList.add("task-item");

  const taskContent = document.createElement("p");
  taskContent.innerText = task.description;

  if (task.isCompleted) {
    taskContent.classList.add("completed");
  }

  taskContent.addEventListener("click", () => handleClick(taskContent, task.id));

  const deleteItem = document.createElement("i");
  deleteItem.classList.add("fa-regular");
  deleteItem.classList.add("fa-trash-can");

  deleteItem.addEventListener("click", () => handleDeletClick(taskItemContainer, task.id));

  const checkboxLabel = document.createElement("label");
  checkboxLabel.innerText = "Completo";
  checkboxLabel.classList.add("checkbox-label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("complete-checkbox");

  if (task.isCompleted) {
    checkbox.checked = true;
  }

  checkbox.addEventListener("change", () => handleCheckboxChange(taskContent, checkbox, task.id));

  checkboxLabel.prepend(checkbox);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action-container");
  actionContainer.appendChild(checkboxLabel);
  actionContainer.appendChild(deleteItem);

  taskItemContainer.appendChild(taskContent);
  taskItemContainer.appendChild(actionContainer);

  tasksContainer.appendChild(taskItemContainer);
};

const resfreshTasksUsingLocalStorage = async () => {
  const tasksFromAPI = await fetchTasks();
  tasksFromAPI.forEach(task => addTaskToDOM(task));
};

resfreshTasksUsingLocalStorage();

addTaskButton.addEventListener("click", () => handleAddTask());
inputElement.addEventListener("change", () => handleInputChange());

const handleInputChange = () => {
  const inputIsValid = validateInput();
  if (inputIsValid) {
    return inputElement.classList.remove("error");
  }
};
