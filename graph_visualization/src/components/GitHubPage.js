import React, { useState } from 'react';
import GraphVisualization from './GraphVisualization';
import './GitHubPage.css';

const GitHubPage = () => {
  const [username, setUsername] = useState('');
  const [depth, setDepth] = useState(2);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleDepthChange = (e) => setDepth(e.target.value);

  const handleGenerateGraph = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://your-backend-url/api/graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, depth: parseInt(depth, 10) }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setGraphData(prepareGraphData(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareGraphData = (data) => {
    const nodes = Object.keys(data).map((id) => ({ id, label: id }));
    const edges = [];
    Object.entries(data).forEach(([source, targets]) => {
      targets.forEach((target) => {
        edges.push({ from: source, to: target });
      });
    });
    return { nodes, edges };
  };

  return (
    <div className="github-page">
      <h1>Git Hub</h1>
      <div>
        <label>Username:</label>
        <input
          type="text"
          placeholder="e.g. gaurav-kadyan"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label>Depth:</label>
        <input
          type="number"
          placeholder="e.g. 3"
          value={depth}
          onChange={handleDepthChange}
        />
      </div>
      <button onClick={handleGenerateGraph} disabled={loading}>
        {loading ? 'Loading...' : 'Generate Graph'}
      </button>

      {error && <p className="error">{error}</p>}
      {graphData && <GraphVisualization data={graphData} />}
    </div>
  );
};

export default GitHubPage;
