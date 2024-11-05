import React from 'react';
import './Sidebar.css';

function Sidebar({ setActivePage }) {
  return (
    <div className="sidebar">
      <h2>App List</h2>
      <ul>
        <li onClick={() => setActivePage('github')}>Git Hub</li>
        <li onClick={() => setActivePage('linkedin')}>LinkedIn</li>
        <li onClick={() => setActivePage('twitter')}>Twitter</li>
      </ul>
    </div>
  );
}

export default Sidebar;
