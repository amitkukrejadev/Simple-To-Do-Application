// Select elements from the DOM
const todoInput = document.querySelector('.todo-input');
const addButton = document.querySelector('.todo-add-button');
const todoList = document.querySelector('.todo-list');

// Load tasks from localStorage when the page loads
window.addEventListener('load', loadTasks);

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const todoItem = createTodoItem(task.text, task.completed);
        todoList.appendChild(todoItem);
    });
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach(item => {
        const taskText = item.querySelector('label').textContent;
        const isCompleted = item.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to create a new todo item
function createTodoItem(taskText, completed = false) {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');

    // Create the move button (three-line menu)
    const moveButton = document.createElement('button');
    moveButton.classList.add('move-button');
    moveButton.innerHTML = '|||';
    moveButton.setAttribute('draggable', true); // Make it draggable

    // Drag and drop functionality
    moveButton.addEventListener('dragstart', (event) => {
        event.dataTransfer.effectAllowed = 'move'; 
        event.dataTransfer.setData('text/plain', null); 
        setTimeout(() => todoItem.classList.add('dragging'), 0);
    });

    moveButton.addEventListener('dragend', () => {
        todoItem.classList.remove('dragging'); 
    });

    todoList.addEventListener('dragover', (event) => {
        event.preventDefault(); // Allow dropping
    });

    todoList.addEventListener('drop', (event) => {
        event.preventDefault(); 
        const draggingItem = document.querySelector('.dragging');
        if (draggingItem && draggingItem !== todoItem) {
            const allItems = Array.from(todoList.querySelectorAll('.todo-item'));
            const draggingIndex = allItems.indexOf(draggingItem);
            const currentIndex = allItems.indexOf(todoItem);

            if (draggingIndex < currentIndex) {
                todoList.insertBefore(draggingItem, todoItem); 
            } else {
                todoList.insertBefore(draggingItem, todoItem.nextSibling); 
            }
            saveTasks(); // Save updated task order
        }
    });

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;

    checkbox.addEventListener('change', () => {
        label.classList.toggle('completed', checkbox.checked);
        saveTasks();
    });

    // Create label for the task
    const label = document.createElement('label');
    label.textContent = taskText;
    if (completed) {
        label.classList.add('completed');
    }

    // Make label editable on double-click
    label.addEventListener('dblclick', () => {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = label.textContent;

        todoItem.replaceChild(inputField, label);
        inputField.focus();

        inputField.addEventListener('blur', () => {
            if (inputField.value.trim() !== '') {
                label.textContent = inputField.value.trim();
                todoItem.replaceChild(label, inputField);
                saveTasks();
            }
        });

        inputField.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                inputField.blur(); 
            }
        });
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '✕';

    deleteButton.addEventListener('click', () => {
        todoList.removeChild(todoItem); 
        saveTasks(); 
    });

    // Append elements to the list item
    todoItem.appendChild(moveButton);
    todoItem.appendChild(checkbox);
    todoItem.appendChild(label);
    todoItem.appendChild(deleteButton);

    return todoItem;
}

// Function to add a new task
function addTask() {
    const taskText = todoInput.value.trim(); 
    if (taskText === '') return; 

    const todoItem = createTodoItem(taskText);
    todoList.appendChild(todoItem);
    saveTasks();
    todoInput.value = ''; 
}

// Event listener for the add button
addButton.addEventListener('click', addTask);

// Allow pressing "Enter" to add a task
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});
