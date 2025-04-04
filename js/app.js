document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    let tasks = [];
    taskForm.addEventListener('submit', (e) => {
        var vti = taskInput.value.trim();
        if (vti !== ''){
            const task ={
                id: Date.now,
                text: vti,
                complete: false
            };
            tasks.push(task);
            console.log(tasks);
            renderTasks();
            taskInput.value = '';
        }
    });
    function renderTasks(){
        taskList.innerHTML = '';
        tasks.forEach(
            task => {
                const li = document.createElement('li');
                li.innerHTML = 
                '<span> ${task.text}</span>'+
                '<div>' +
                '<button onclick="delateTask(${task.id})">'+
                'Eliminar </button>'+
                '</div>';
                taskList.innerHTML = li;
            }
        );
    }
});
