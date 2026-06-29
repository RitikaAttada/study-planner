import { useState, useEffect } from 'react';
import API from '../api';
import './Timetable.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fddb92'];

const Timetable = () => {
  const [slots, setSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    color: '#667eea'
  });

  const fetchTimetable = async () => {
    try {
      const res = await API.get('/timetable');
      setSlots(res.data.slots);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/timetable/slot', newSlot);
      setNewSlot({ day: 'Monday', startTime: '09:00', endTime: '10:00', subject: '', color: '#667eea' });
      setShowForm(false);
      fetchTimetable();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (slotId) => {
    try {
      await API.delete(`/timetable/slot/${slotId}`);
      fetchTimetable();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="timetable">
      <div className="timetable-header">
        <h3>Weekly Timetable</h3>
        <button className="add-slot-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Slot'}
        </button>
      </div>

      {showForm && (
        <form className="slot-form" onSubmit={handleAdd}>
          <select
            value={newSlot.day}
            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
          >
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
          <input
            type="text"
            placeholder="Subject name"
            value={newSlot.subject}
            onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
            required
          />
          <div className="time-inputs">
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            />
            <span>to</span>
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            />
          </div>
          <div className="color-picker">
            {COLORS.map(c => (
              <div
                key={c}
                className={`color-dot ${newSlot.color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setNewSlot({ ...newSlot, color: c })}
              />
            ))}
          </div>
          <button type="submit">Save Slot</button>
        </form>
      )}

      <div className="timetable-grid">
        {DAYS.map(day => {
          const daySlots = slots.filter(s => s.day === day);
          return (
            <div key={day} className="timetable-day">
              <div className="day-label">{day}</div>
              <div className="day-slots">
                {daySlots.length === 0 && (
                  <p className="no-slot">No classes</p>
                )}
                {daySlots.map(slot => (
                  <div
                    key={slot._id}
                    className="slot-card"
                    style={{ borderLeft: `4px solid ${slot.color}` }}
                  >
                    <div className="slot-info">
                      <p className="slot-subject">{slot.subject}</p>
                      <p className="slot-time">{slot.startTime} - {slot.endTime}</p>
                    </div>
                    <button className="delete-slot-btn" onClick={() => handleDelete(slot._id)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timetable;