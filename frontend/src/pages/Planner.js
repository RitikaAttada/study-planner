import { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Planner.css';
import Timetable from '../components/Timetable';

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', plannedMinutes: 30 });

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${selectedDate}`);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { ...newTask, date: selectedDate });
      setNewTask({ title: '', plannedMinutes: 30 });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (task) => {
    try {
      if (!task.completed) {
        await API.post(`/tasks/complete/${task._id}`);
      } else {
        await API.put(`/tasks/${task._id}`, { completed: false });
      }
      fetchTasks();
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

  const getDaysInMonth = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth();
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const changeMonth = (dir) => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() + dir);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="planner">
      <h1>Planner</h1>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <h2>{monthName} {year}</h2>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="calendar-day-name">{d}</div>
          ))}
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            return (
              <div
                key={day}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="planner-tasks">
        <h3>Tasks for {selectedDate}</h3>
        <form onSubmit={handleAddTask} className="planner-form">
          <input
            type="text"
            placeholder="Task title..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Minutes"
            value={newTask.plannedMinutes}
            onChange={(e) => setNewTask({ ...newTask, plannedMinutes: e.target.value })}
            min="1"
          />
          <button type="submit">+ Add</button>
        </form>

        {tasks.length === 0 && <p className="no-tasks">No tasks for this day!</p>}
        {tasks.map(task => (
          <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleComplete(task)}
            />
            <div className="task-info">
              <p className="task-title">{task.title}</p>
              <p className="task-minutes">⏱ {task.plannedMinutes} mins</p>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(task._id)}>🗑</button>
          </div>
        ))}
      </div>
      <Timetable/>
    </div>
  );
};

export default Planner;