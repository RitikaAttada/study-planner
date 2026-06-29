import { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [selected, setSelected] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/notes', newNote);
      setNewNote({ title: '', content: '' });
      setIsAdding(false);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      if (selected?._id === id) setSelected(null);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="notes-container">
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">
          <h2>📝 Notes</h2>
          <button onClick={() => { setIsAdding(true); setSelected(null); }}>+ New</button>
        </div>
        {notes.length === 0 && <p className="no-notes">No notes yet!</p>}
        {notes.map(note => (
          <div
            key={note._id}
            className={`note-item ${selected?._id === note._id ? 'active' : ''}`}
            onClick={() => { setSelected(note); setIsAdding(false); }}
          >
            <p className="note-item-title">{note.title}</p>
            <p className="note-item-preview">{note.content.substring(0, 50)}...</p>
          </div>
        ))}
      </div>

      <div className="notes-main">
        {isAdding && (
          <form className="note-form" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              required
              rows={12}
            />
            <div className="note-form-actions">
              <button type="submit">Save Note</button>
              <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        )}

        {selected && !isAdding && (
          <div className="note-view">
            <div className="note-view-header">
              <h2>{selected.title}</h2>
              <button className="delete-note-btn" onClick={() => handleDelete(selected._id)}>🗑 Delete</button>
            </div>
            <p className="note-date">{new Date(selected.createdAt).toDateString()}</p>
            <p className="note-content">{selected.content}</p>
          </div>
        )}

        {!isAdding && !selected && (
          <div className="notes-empty">
            <p>📝</p>
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;