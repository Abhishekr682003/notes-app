import React from 'react';

const NoteItem = ({ note, onDelete, onEdit }) => {
    return (
        <div className="note-item">
            <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
            </div>
            <p className="note-content">{note.content}</p>
            <small className="note-date">
                {new Date(note.updatedAt).toLocaleString()}
            </small>
            <div className="note-actions">
                <button
                    onClick={() => onEdit(note)}
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(note._id)}
                    className="btn-danger"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default NoteItem;
