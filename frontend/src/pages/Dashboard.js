import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import '../styles/Dashboard.css';
import TaskPieChart from '../components/Charts';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', plannedMinutes: 30 });
  const [streak, setStreak] = useState(user?.streak || 0);
  const [allTasks, setAllTasks] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${today}`);
      console.log('today tasks:', res.data);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const res = await API.get('/tasks/all');
      console.log('all tasks:', res.data);
      setAllTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStreak = async () => {
  try {
    const res = await API.get('/auth/me');
    setStreak(res.data.streak);
  } catch (err) {
    console.log(err);
  }
};
  useEffect(() => {
    fetchTasks();
    fetchAllTasks();
    fetchStreak();
  }, []);
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { ...newTask, date: today });
      setNewTask({ title: '', plannedMinutes: 30 });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

 const handleComplete = async (task) => {
  try {
    if (!task.completed) {
      const res = await API.post(`/tasks/complete/${task._id}`);
      setStreak(res.data.streak);
    } else {
      await API.put(`/tasks/${task._id}`, { completed: false });
    }
    await fetchTasks();
    await fetchAllTasks();
  } catch (err) {
    console.log(err);
  }
};

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weeklyTasks = allTasks.filter(t => new Date(t.date) >= weekStart);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Good day, {user?.name}! 👋</h1>
          <p className="dashboard-date">{new Date().toDateString()}</p>
        </div>
        <div className="streak-card">
          <span className="streak-fire">🔥</span>
          <div>
            <p className="streak-number">{streak}</p>
            <p className="streak-label">Day Streak</p>
          </div>
        </div>
      </div>

      <div className="progress-card">
        <div className="progress-info">
          <span>Today's Progress</span>
          <span>{completed}/{total} tasks done</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="add-task-form">
        <h3>Add Task for Today</h3>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Planned minutes"
            value={newTask.plannedMinutes}
            onChange={(e) => setNewTask({ ...newTask, plannedMinutes: e.target.value })}
            min="1"
          />
          <button type="submit">+ Add Task</button>
        </form>
      </div>

      <div className="tasks-section">
        <h3>Today's Tasks</h3>
        {tasks.length === 0 && <p className="no-tasks">No tasks yet — add one above!</p>}
        {tasks.map(task => (
          <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleComplete(task)}
            />
            <div className="task-info">
              <p className="task-title">{task.title}</p>
              <p className="task-minutes">⏱ {task.plannedMinutes} mins planned</p>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(task._id)}>🗑</button>
          </div>
        ))}
      </div>
      <div className="charts-section">
        <TaskPieChart tasks={tasks} title="Today's Time Breakdown" />
        <TaskPieChart tasks={weeklyTasks} title="This Week's Time Breakdown" />
      </div>
    </div>
  );
};

export default Dashboard;