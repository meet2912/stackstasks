let tasks = [];

document.addEventListener('DOMContentLoaded',()=>{
    const storedTasks = JSON.parse(localStorage.getItem('tasks'))
    
    if(storedTasks){
        tasks = storedTasks; // Directly assign the stored tasks
        updateTaskList();
        updateStats();    
    }
})

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();   

    if (text) {
        if (editIndex !== null) {
            tasks[editIndex] = { text: text, completed: false }; // Replace in place
            console.log(`[ACTION] Task edited at index ${editIndex}: "${text}"`);
            editIndex = null; // Reset
        } else {
            tasks.push({ text: text, completed: false });
            console.log(`[ACTION] Task added: "${text}"`);
        }

        updateTaskList();
        updateStats();
        saveTask();
        taskInput.value = '';
    } else {
        console.log('[ACTION] Attempted to add empty task');
    }
};

const saveTask=()=>{
    localStorage.setItem('tasks',JSON.stringify(tasks))
}

const updateTaskList = () => {
    const taskList = document.querySelector(".task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        
        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}" data-index="${index}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="pen.png" alt="edit" class="edit-btn" data-index="${index}">
                <img src="trash.png" alt="delete" class="delete-btn" data-index="${index}">
            </div>
        </div>`;
        listItem.addEventListener('change', () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    });
};
    

// Toggle task completion
const toggleTaskComplete = (index) => {
    const task = tasks[index];
    const newStatus = !task.completed;
    console.log(`[ACTION] Task ${index} marked as ${newStatus ? 'completed' : 'incomplete'}: "${task.text}"`);
    
    task.completed = newStatus;
    updateTaskList();
    updateStats();
    saveTask();
    
    console.log('[STATE] Updated task:', task);
};

// Delete a task
const deleteTask = (index) => {
    const deletedTask = tasks[index];
    console.log(`[ACTION] Task ${index} deleted: "${deletedTask.text}"`);
    
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTask();
    
    console.log('[STATE] Remaining tasks:', [...tasks]);
};

// Edit a task
let editIndex = null; // Add this at the top-level scope

const editTask = (index) => {
    const taskText = tasks[index].text;
    console.log(`[ACTION] Editing task ${index}: "${taskText}"`);
    
    editIndex = index; // Save the index for later

    const taskInput = document.getElementById("taskInput");
    taskInput.value = taskText;
    taskInput.focus();
};

//UPDATE THE PROGRESS
const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completeTasks / totalTasks) * 100 : 0;
    const progressBar = document.querySelector(".progress");
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    const numberElement = document.getElementById("number");
    if (numberElement) {
        numberElement.textContent = `${completeTasks} / ${totalTasks}`;
    }
    console.log(`[STATS] Progress: ${completeTasks}/${totalTasks} (${progress.toFixed(1)}%)`);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('[APP] To-Do List initialized');
    console.log(`[STATE] Loaded ${tasks.length} tasks from storage`);
    
    // Add new task
    document.getElementById("newTask").addEventListener("click", function(e) {
        e.preventDefault();
        console.log('[ACTION] Add task button clicked');
        addTask();
    });

    // Add task on Enter key
    document.getElementById("taskInput").addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('[ACTION] Enter key pressed in task input');
            addTask();
        }
    });

        // Event delegation for task actions
    document.querySelector('.task-list').addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle delete button
        if (target.classList.contains('delete-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            console.log(`[ACTION] Deleting task ${index}`);
            deleteTask(index);
            e.preventDefault();
        }
        // Handle edit button - move task text to input
        else if (target.classList.contains('edit-btn')) {
            const index = parseInt(target.getAttribute('data-index'));
            editTask(index);
            e.preventDefault();
        }
        // Handle checkbox toggle
        else if (target.classList.contains('checkbox')) {
            const index = parseInt(target.closest('.task').getAttribute('data-index'));
            console.log(`[ACTION] Checkbox toggled for task ${index}`);
            toggleTaskComplete(index);
        }
    });
    
    // Log initial state
    updateStats();
});
