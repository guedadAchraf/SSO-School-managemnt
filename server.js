const express = require('express');
const cors = require('cors');
const app = express();
const defaultPort = 3000;

app.use(cors());
app.use(express.json());

// Mock data
const mockData = {
  stats: {
    students: 1250,
    teachers: 75,
    courses: 48
  },
  students: [
    { id: 1, name: 'John Doe', grade: 'A' },
    { id: 2, name: 'Jane Smith', grade: 'B+' }
  ],
  teachers: [
    { id: 1, name: 'Dr. Wilson', department: 'Science' },
    { id: 2, name: 'Mrs. Brown', department: 'Mathematics' }
  ],
  courses: [
    { id: 1, name: 'Advanced Mathematics', teacher: 'Mrs. Brown' },
    { id: 2, name: 'Physics 101', teacher: 'Dr. Wilson' }
  ],
  teacherCourses: [
    {
      id: 1,
      name: 'Advanced Mathematics',
      students: [
        { id: 1, name: 'John Doe', grade: 'A' },
        { id: 2, name: 'Jane Smith', grade: 'B+' }
      ]
    },
    {
      id: 2,
      name: 'Physics 101',
      students: [
        { id: 3, name: 'Bob Wilson', grade: 'A-' },
        { id: 4, name: 'Alice Brown', grade: 'B' }
      ]
    }
  ]
};

// API Routes
app.get('/api/stats', (req, res) => {
  res.json(mockData.stats);
});

app.get('/api/students', (req, res) => {
  res.json(mockData.students);
});

app.get('/api/teachers', (req, res) => {
  res.json(mockData.teachers);
});

app.get('/api/courses', (req, res) => {
  res.json(mockData.courses);
});

app.get('/api/teachers/courses', (req, res) => {
  res.json(mockData.teacherCourses);
});

app.post('/api/grades', (req, res) => {
  const { courseId, studentId, grade } = req.body;
  // In a real application, you would update the database here
  res.json({ success: true });
});

// POST endpoints for creating new entities
app.post('/api/students', (req, res) => {
  const newStudent = req.body;
  mockData.students.push({
    id: mockData.students.length + 1,
    ...newStudent
  });
  res.json({ success: true, data: newStudent });
});

app.post('/api/teachers', (req, res) => {
  const newTeacher = req.body;
  mockData.teachers.push({
    id: mockData.teachers.length + 1,
    ...newTeacher
  });
  res.json({ success: true, data: newTeacher });
});

app.post('/api/courses', (req, res) => {
  const newCourse = req.body;
  mockData.courses.push({
    id: mockData.courses.length + 1,
    ...newCourse
  });
  res.json({ success: true, data: newCourse });
});

// Function to try different ports
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      // Update proxy configuration if using different port
      updateProxyConfig(port);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

// Function to update proxy configuration
const updateProxyConfig = (port) => {
  const fs = require('fs');
  const proxyConfigPath = './proxy.conf.json';
  
  try {
    const proxyConfig = {
      "/api": {
        "target": `http://localhost:${port}`,
        "secure": false,
        "changeOrigin": true
      }
    };
    
    fs.writeFileSync(proxyConfigPath, JSON.stringify(proxyConfig, null, 2));
    console.log(`Updated proxy configuration to use port ${port}`);
  } catch (err) {
    console.warn('Failed to update proxy configuration:', err);
  }
};

// Start the server
startServer(defaultPort); 