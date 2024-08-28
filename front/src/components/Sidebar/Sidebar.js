import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';
import newIcon from '../../assets/img_src/new.png';

const Sidebar = () => {
    const [hasNewNotice, setHasNewNotice] = useState(false);

    useEffect(() => {
        const checkNewNotices = async () => {
            try {
                const response = await axios.get('http://localhost:8080/notice/has-new');
                setHasNewNotice(response.data);
            } catch (error) {
                console.error('Failed to check new notices:', error);
            }
        };

        checkNewNotices();
    }, []);

    return (
        <div className="sidebar">
            <h2>RUNNING</h2>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/recruit/list"
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            LIGHTNING
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/incruit/list"
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            CREW
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/notice/list"
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            NOTICE {hasNewNotice && <img src={newIcon} alt="New" className="new-icon" />}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/info/list"
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            INFO
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/free/list"
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            FREE
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/review/list"
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            REVIEW
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
