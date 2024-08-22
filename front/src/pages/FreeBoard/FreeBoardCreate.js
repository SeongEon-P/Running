import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FreeBoard.css';

const FreeBoardCreate = ({ addPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleCreate = () => {
        if (title && content) {
            addPost({ title, content });
            navigate('/free/list');
        }
    };

    return (
        <div className="free-board">
            <h1>Create a New Post</h1>
            <div className="form">
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <textarea 
                    placeholder="Content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <button onClick={handleCreate}>글작성</button>
            </div>
        </div>
    );
};

export default FreeBoardCreate;
