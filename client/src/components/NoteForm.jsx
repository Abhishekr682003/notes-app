import React, { useState, useEffect } from 'react';

const NoteForm = ({ onAdd, currentNote, onUpdate, clearCurrent }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [currentNote]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) return;

        if (currentNote) {
            onUpdate(currentNote._id, { title, content });
        } else {
            onAdd({ title, content });
        }

        setTitle('');
        setContent('');
        if (currentNote) {
            clearCurrent();
        }
    };

    const handleCancelRef = (e) => {
        e.preventDefault();
        clearCurrent();
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
                {currentNote ? 'Edit Note' : 'Add New Note'}
            </h2>
            <input
                type="text"
                id="note-title"
                name="title"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                id="note-content"
                name="content"
                placeholder="Note Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                required
            ></textarea>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn-primary">
                    {currentNote ? 'Update Note' : 'Add Note'}
                </button>
                {currentNote && (
                    <button onClick={handleCancelRef} className="btn-danger" style={{ backgroundColor: '#94a3b8' }}>
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
    );
};

export default NoteForm;
