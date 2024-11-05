import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import GitHub from './components/GitHubPage';

function App() {
  const [activePage, setActivePage] = useState('github');

  return (
    <div className="app-container">
      <Sidebar setActivePage={setActivePage} />
      <div className="content">
        {activePage === 'github' && <GitHub />}
        {activePage === 'linkedin' && <h1>LinkedIn Page - Coming Soon!</h1>}
        {activePage === 'twitter' && <h1>Twitter Page - Coming Soon!</h1>}
      </div>
    </div>
  );
}

export default App;
