import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';  // Sidebar 추가
import './FreeBoard.css';

const FreeBoardList = ({ posts }) => {
    return (
        <div className="free-board-container">
            <Sidebar /> {/* Sidebar 컴포넌트 추가 */}
            <div className="free-board">
                <h1>Free Board</h1>
                <Link to="/free/create">
                    <button>글작성</button>
                </Link>
                <div className="posts">
                    {posts.map((post, index) => (
                        <div key={index} className="post">
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <button>수정</button>
                            <button>삭제</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FreeBoardList;
