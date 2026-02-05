import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NoteForm from './NoteForm';
import NoteList from './NoteList';
import AuthContext from '../context/AuthContext';
import '../App.css';

function Home() {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch notes
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/notes');
            setNotes(response.data);
            setError(null);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Token might be expired
                logout();
                return;
            }
            setError('Failed to fetch notes. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    // Add note
    const addNote = async (note) => {
        try {
            const response = await api.post('/notes', note);
            setNotes([response.data, ...notes]);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to add note.';
            setError(errorMsg);
            console.error('Add note error:', err);
        }
    };

    // Delete note
    const deleteNote = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await api.delete(`/notes/${id}`);
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
            const response = await api.put(`/notes/${id}`, updatedNote);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>My Notes {user && `(${user.username})`}</h1>
                <button onClick={logout} style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Logout</button>
            </div>

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

export default Home;
