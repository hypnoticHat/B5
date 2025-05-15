// DOM
const userListEl = document.getElementById('userList');
const taskListEl = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const addUserBtn = document.getElementById('addUserBtn'); // Nút Add User
const saveBtn = document.getElementById('saveBtn'); // Nút Save

let users = [];
let tasks = [];

// Load JSON data
async function loadData() {
  [users, tasks] = await Promise.all([
    fetch('../data/users.json').then(r => r.json()),
    fetch('../data/tasks.json').then(r => r.json())
  ]);
  render();
}

// Render UI
function render() {
    userListEl.innerHTML = '';
    taskListEl.innerHTML = '';
  
    // Sidebar users
    users.forEach(u => {
      const el = document.createElement('div');
      el.className = 'user-card';
      el.textContent = u.name;
      el.draggable = true;
      el.dataset.userId = u.id;
  
      el.addEventListener('dragstart', () => {
        draggedUserId = u.id;
      });
  
      userListEl.append(el);
    });
  
    // Task cards
    tasks.forEach(t => {
      const card = document.createElement('div');
      card.className = 'task-card';
  
      // Tính số ngày còn lại
      const now = new Date();
      const dueDate = t.dueDate ? new Date(t.dueDate) : null;
      let daysLeft = null;
      if (dueDate && !isNaN(dueDate.getTime())) {
        daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      }
  
      // Gán màu sắc theo số ngày còn lại
      if (daysLeft != null) {
        if (daysLeft >= 7) {
          card.classList.add('green'); // Xanh lá
        } else if (daysLeft >= 3) {
          card.classList.add('yellow'); // Vàng
        } else if (daysLeft >= 1) {
          card.classList.add('red'); // Đỏ
        } else {
          card.classList.add('expired'); // Quá hạn
        }
      }
  
      // Task info
      const info = document.createElement('div');
      info.className = 'task-info';
      info.innerHTML = `
        <strong>${t.title}</strong>
        <p>${t.description || 'No description provided.'}</p>
        <p><small><b>Start Date:</b> ${t.startDate || '–'}</small></p>
        <p><small><b>Due Date:</b> ${t.dueDate || '–'}</small></p>
        <p><small><b>Priority:</b> ${t.priority}</small></p>
        <p><small><b>Status:</b> ${t.status}</small></p>
      `;
      card.append(info);
  
      // Buttons: Update and Delete
      const btnContainer = document.createElement('div');
      btnContainer.className = 'btn-container';
  
      const updateBtn = document.createElement('button');
      updateBtn.textContent = 'Sửa';
      updateBtn.className = 'update-btn';
      updateBtn.addEventListener('click', () => updateTask(t.id));
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Xóa';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => deleteTask(t.id));
  
      btnContainer.append(updateBtn, deleteBtn);
      card.append(btnContainer);
  
      // Assigned area
      const area = document.createElement('div');
      area.className = 'assigned-area';
      area.dataset.taskId = t.id;
  
      area.addEventListener('dragover', e => {
        e.preventDefault();
        area.classList.add('over');
      });
  
      area.addEventListener('dragleave', () => {
        area.classList.remove('over');
      });
  
      area.addEventListener('drop', () => {
        area.classList.remove('over');
        if (draggedUserId == null) return;
  
        if (!t.assignedUserIds.includes(draggedUserId)) {
          t.assignedUserIds.push(draggedUserId);
          render();
        }
      });
  
      t.assignedUserIds.forEach(uid => {
        const u = users.find(user => user.id === uid);
        if (!u) return;
  
        const udiv = document.createElement('div');
        udiv.className = 'assigned-user';
        udiv.textContent = u.name.split(' ')[0];
        udiv.dataset.userId = uid;
  
        udiv.addEventListener('click', () => {
          t.assignedUserIds = t.assignedUserIds.filter(id => id !== uid);
          render();
        });
  
        area.append(udiv);
      });
  
      card.append(area);
      taskListEl.append(card);
    });
  }
  
function showTaskOptions(taskId, buttonEl) {
    // Kiểm tra nếu đã có menu, thì xóa trước khi tạo lại
    const existingMenu = document.querySelector('.task-options-menu');
    if (existingMenu) existingMenu.remove();
  
    // Tạo menu mới
    const menu = document.createElement('div');
    menu.className = 'task-options-menu';
    menu.innerHTML = `
      <button class="option-btn" data-action="update">Update Task</button>
      <button class="option-btn" data-action="delete">Delete Task</button>
    `;
  
    // Đặt vị trí menu ngay dưới nút `...`
    const rect = buttonEl.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
  
    // Gắn menu vào body
    document.body.appendChild(menu);
  
    // Đóng menu khi click ngoài
    const closeMenu = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    document.addEventListener('click', closeMenu);
  
    // Xử lý các nút trong menu
    menu.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'update') updateTask(taskId);
        if (action === 'delete') deleteTask(taskId);
        menu.remove(); // Đóng menu sau khi chọn hành động
      });
    });
  }
  
  
  // Update task
  function updateTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
  
    const newTitle = prompt('New Title:', task.title) || task.title;
    const newDescription = prompt('New Description:', task.description) || task.description;
    const newStartDate = prompt('New Start Date (YYYY-MM-DD):', task.startDate) || task.startDate;
    const newDueDate = prompt('New Due Date (YYYY-MM-DD):', task.dueDate) || task.dueDate;
  
    let newPriority;
    while (!['low', 'medium', 'high'].includes(newPriority)) {
      newPriority = prompt('New Priority (low, medium, high):', task.priority).toLowerCase() || task.priority;
    }
  
    let newStatus;
    while (!['pending', 'in-progress', 'completed'].includes(newStatus)) {
      newStatus = prompt('New Status (pending, in-progress, completed):', task.status).toLowerCase() || task.status;
    }
  
    task.title = newTitle;
    task.description = newDescription;
    task.startDate = newStartDate;
    task.dueDate = newDueDate;
    task.priority = newPriority;
    task.status = newStatus;
  
    render();
  }
  
  // Delete task
  function deleteTask(taskId) {
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      tasks = tasks.filter(t => t.id !== taskId);
      render();
    }
  }
  

// Add Task
addTaskBtn.addEventListener('click', () => {
  const title = prompt('Task title:');
  if (!title) return;

  const description = prompt('Task description (optional):') || '';
  const startDate = prompt('Start date (YYYY-MM-DD, optional):') || undefined;
  const dueDate = prompt('Due date (YYYY-MM-DD, optional):') || undefined;

  let priority;
  while (!['low', 'medium', 'high'].includes(priority)) {
    priority = prompt('Priority (low, medium, high):').toLowerCase();
  }

  let status;
  while (!['pending', 'in-progress', 'completed'].includes(status)) {
    status = prompt('Status (pending, in-progress, completed):').toLowerCase();
  }

  const newId = (tasks[tasks.length - 1]?.id || 0) + 1;
  tasks.push({
    id: newId,
    title,
    description,
    startDate,
    dueDate,
    priority,
    status,
    assignedUserIds: [],
    createdAt: new Date().toISOString()
  });

  render();
});

// Add User
addUserBtn.addEventListener('click', () => {
  const name = prompt('User name:');
  if (!name) return;
  const email = prompt('User email (optional):') || '';

  const newId = (users[users.length - 1]?.id || 0) + 1;
  users.push({
    id: newId,
    name,
    email,
    createdAt: new Date().toISOString()
  });

  render();
});

// Save changes
saveBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:4000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users, tasks }),
      });
  
      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        alert('Failed to save data. Please try again.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('An error occurred while saving data.');
    }
  });
  
  
// Start app
loadData();
