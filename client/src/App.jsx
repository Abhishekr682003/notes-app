import React, { useState, useEffect } from 'react';
import api from './services/api';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('');
      setNotes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add note
  const addNote = async (note) => {
    try {
      const response = await api.post('', note);
      setNotes([response.data, ...notes]);
    } catch (err) {
      setError('Failed to add note.');
      console.error(err);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError('Failed to delete note.');
      console.error(err);
    }
  };

  // Set note to edit
  const editNote = (note) => {
    setCurrentNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update note
  const updateNote = async (id, updatedNote) => {
    try {
      const response = await api.put(`/${id}`, updatedNote);
      setNotes(
        notes.map((note) => (note._id === id ? response.data : note))
      );
      setCurrentNote(null);
    } catch (err) {
      setError('Failed to update note.');
      console.error(err);
    }
  };

  // Clear current selection
  const clearCurrent = () => {
    setCurrentNote(null);
  };

  return (
    <div className="container">
      <h1>My Notes</h1>

      {error && <div className="error-message">{error}</div>}

      <NoteForm
        onAdd={addNote}
        currentNote={currentNote}
        onUpdate={updateNote}
        clearCurrent={clearCurrent}
      />

      {loading ? (
        <div className="loading-spinner">Loading notes...</div>
      ) : (
        <NoteList
          notes={notes}
          onDelete={deleteNote}
          onEdit={editNote}
        />
      )}
    </div>
  );
}

export default App;
