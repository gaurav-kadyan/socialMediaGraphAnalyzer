// src/Dashboard.js
import React, { useState } from 'react';
import './dashboard.css';

function Dashboard() {
  const [activeSection, setActiveSection] = useState("Git Hub");

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>App List</h2>
        <ul>
          <li onClick={() => handleMenuClick("Git Hub")}>Git Hub</li>
          <li onClick={() => handleMenuClick("Linkdin")}>Linkdin</li>
          <li onClick={() => handleMenuClick("Twitter")}>Twitter</li>
        </ul>
      </aside>
      
      <main className="content">
        <h1>{activeSection}</h1>
        <div className="input-section">
          {activeSection === "Git Hub" && (
            <>
              <label>
                Username:
                <input type="text" placeholder="e.g. gaurav-kadyan" />
              </label>
              <label>
                Depth:
                <input type="text" placeholder="e.g. 3" />
              </label>
            </>
          )}
          {activeSection === "Linkdin" && (
            <p>Linkdin gives limited number of API's hit that's why not sufficient data.</p>
          )}
          {activeSection === "Twitter" && (
            <p>Twitter gives limited number of API's hit that's why not sufficient data.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
