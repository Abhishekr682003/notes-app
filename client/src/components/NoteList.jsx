import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onDelete, onEdit }) => {
    if (!notes || notes.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
                No notes yet. Add one above!
            </div>
        );
    }

    return (
        <div className="note-list">
            {notes.map((note) => (
                <NoteItem
                    key={note._id}
                    note={note}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default NoteList;
