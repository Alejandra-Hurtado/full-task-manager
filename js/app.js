document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('my-form');
    const completeInput = document.getElementById('complete');
    const userIdInput = document.getElementById('user_id');
    const categoryIdInput = document.getElementById('category_id');
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const dateInput = document.getElementById('due_date');
    const nameInput = document.getElementById('name');
    const categoryInput = document.getElementById('category_id_c');
    const userInput = document.getElementById('user_id_c');

    const categoryForm = document.getElementById('categoryForm');
    const categoryList = document.getElementById('category-list');

    let tasks = [];
    let isEditing = false;
    let editingId = null;
    let categories = [];
    let isEditingCategory = false;
    let editingCategoryId = null;

    // ========== Inicializar ==========
    fetch('server/user/session_info.php')
        .then(res => res.json())
        .then(data => {
            if (data.user_id) {
                userIdInput.value = data.user_id;
                renderTasks(data.user_id);
                renderCategories(data.user_id);
            } else {
                console.warn(data.error);
                window.location.href = 'login.php';
            }
        });

    function renderTasks(user_id) {
        fetch('server/task/list.php?user_id=' + user_id)
            .then(res => res.json())
            .then(tks => {
                tasks = tks;
                taskList.innerHTML = '';
                if (tasks.length === 0) {
                    taskList.innerHTML = '<li>No hay tareas registradas.</li>';
                    return;
                }

                tasks.forEach(task => {
                    const li = document.createElement('li');
                    if (task.completed) {
                        li.className = 'task-ready';
                        li.innerHTML =
                            '<span >' + task.title + '</span>' +
                            '<div>' +
                            '<button class="complete-btn" onclick="undoTask(' + task.id + ')">' +
                            'Desmarcar </button>'
                        '</div>'
                    }
                    else {
                        li.innerHTML =
                            '<span >' + task.title + '</span>' +
                            '<div>' +
                            '<button class="edit-btn" onclick="editTask(' + task.id + ')">' +
                            'Editar </button>' +
                            '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">' +
                            'Eliminar </button>' +
                            '<button class="complete-btn" onclick="completeTask(' + task.id + ')">' +
                            'Completar </button>'
                        '</div>';

                        //si la tarea esta completada, al elemento li le agrego la clase completed
                        if (task.complete) {
                            li.classList.add('completed');
                        }
                    }
                    taskList.appendChild(li);
                });
            })
            .catch(err => console.error('Error al listar tareas:', err));
    }


    function renderCategories(user_id) {
        fetch('server/category/list.php?user_id=' + user_id)
            .then(res => res.json())
            .then(cat => {
                categories = cat;
                categoryList.innerHTML = '';
                if (categories.length === 0) {
                    categoryList.innerHTML = '<li>No hay tareas registradas.</li>';
                    return;
                }
                categories.forEach(category => {
                    const li = document.createElement('li');
                    li.innerHTML =
                        '<span>' + category.name + '</span>' +
                        '<span>' + category.category_id + '</span>' +
                        '<div>' +
                        '<button class="edit-btn" onclick="editCategory(' + category.category_id + ')">' +
                        'Editar</button>' +
                        '<button class="delete-btn" onclick="deleteCategory(' + category.category_id + ')">' +
                        'Eliminar</button>' +
                        '</div>';

                    categoryList.appendChild(li);
                });
            })
            .catch(err => console.error('Error al listar tareas:', err));
    }

    window.deleteTask = function (id) {
        fetch('server/task/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(response => {
                console.log('Delete response:', response);
                renderTasks(userIdInput.value);
            });
    };
    // Editar tarea: carga los datos en el formulario
    window.editTask = function (id) {
        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                fetch('server/task/list.php?user_id=' + data.user_id)
                    .then(res => res.json())
                    .then(tasks => {
                        const task = tasks.find(t => t.id === id);
                        if (task) {
                            titleInput.value = task.title;
                            descInput.value = task.description;
                            dateInput.value = task.due_date;
                            completeInput.checked = task.completed == 1;
                            userIdInput.value = task.user_id;
                            categoryIdInput.value = task.category_id;
                            currentEditingTaskId = id;
                            submitButton.textContent = "Guardar";
                        }
                    });
            });
    };

    window.completeTask = function (id) {
        console.log("Intentando completar tarea ID:", id);
        fetch('server/task/complete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (data.success) {
                    renderTasks(userIdInput.value); // Recargar las tareas después de completar
                } else {
                    alert("Error al completar la tarea: " + (data.error || "Desconocido"));
                }
            })
            .catch(err => {
                console.error("Error en la solicitud:", err);
            });
    };
    window.undoTask = function (id) {
        console.log("Intentando desmarcar tarea ID:", id);
        fetch('server/task/undo.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);
                if (data.success) {
                    // Recargar las tareas después de desmarcar
                    renderTasks(userIdInput.value); // Esta función recargará las tareas con los botones actualizados
                } else {
                    alert("Error al desmarcar la tarea: " + (data.error || "Desconocido"));
                }
            })
            .catch(err => {
                console.error("Error en la solicitud:", err);
            });
    };


    window.editCategory = function (category_id) {
        fetch('server/user/session_info.php')
            .then(res => res.json())
            .then(data => {
                fetch('server/category/list.php?user_id=' + data.user_id)
                    .then(res => res.json())
                    .then(categories => {
                        const cat = categories.find(t => t.category_id === category_id);
                        if (cat) {
                            nameInput.value = cat.name;
                            userInput.value = cat.user_id;
                            categoryInput.value = cat.category_id;
                            currentEditingCId = category_id;
                            submitButton.textContent = "Guardar";
                        }
                    });
            });
    };

    window.deleteCategory = function (category_id) {
        fetch('server/category/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category_id: category_id })
        })
            .then(res => res.json())
            .then(response => {
                console.log('Delete response:', response);
                renderCategories(userIdInput.value);
            });
    };

    categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('category_name').value;
        const user_id = parseInt(document.getElementById('category_user_id').value);

        fetch('server/category/create.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, user_id })
        })
            .then(res => res.json())
            .then(() => {
                categoryForm.reset();
                renderCategories();
            });
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            id: editingId,
            title: taskInput.value,
            user_id: parseInt(userIdInput.value),
            category_id: parseInt(categoryIdInput.value),
            completed: completeInput.checked
        };
        const url = isEditing ? 'server/task/update.php' : 'server/task/create.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((task) => {
                if (isEditing) {
                    const taskIndex = tasks.findIndex((t) => t.id === task.id);
                    tasks[taskIndex] = task;
                } else {
                    tasks.push(task);
                }
                renderTasks(data.user_id);
                taskInput.value = '';
                userIdInput.value = '';
                categoryIdInput.value = '';
                completeInput.checked = false;
                isEditing = false;
                editingId = null;
            })
            .catch((error) => console.error('Error:', error));
    });

});
