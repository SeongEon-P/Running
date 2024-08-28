import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>RUNNING</h2>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/recruit/list" activeClassName="active">
                            LIGHTNING
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/incruit/list" activeClassName="active">
                            CREW
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/notice/list" activeClassName="active">
                            NOTICE
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/info/list" activeClassName="active">
                            INFO
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/free/list" activeClassName="active">
                            FREE
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/review/list" activeClassName="active">
                            REVIEW
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
