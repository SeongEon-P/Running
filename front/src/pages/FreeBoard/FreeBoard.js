import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import FreeBoardList from './FreeBoardList';
import FreeBoardCreate from './FreeBoardCreate';

const FreeBoard = () => {
    const [posts, setPosts] = useState([]);

    const addPost = (post) => {
        setPosts([...posts, post]);
    };

    return (
        <Routes>
            <Route path="/list" element={<FreeBoardList posts={posts} />} />
            <Route path="/create" element={<FreeBoardCreate addPost={addPost} />} />
        </Routes>
    );
};

export default FreeBoard;
