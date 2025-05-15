const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 

const app = express();
app.use(cors()); 
app.use(express.json());

// Đường dẫn tới các file JSON
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Endpoint: Lưu dữ liệu
app.post('/api/save', (req, res) => {
  const { users, tasks } = req.body;

  try {
    // Ghi dữ liệu vào file JSON
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');

    res.status(200).json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data.' });
  }
});

// Khởi động server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
