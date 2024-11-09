import React, { useState } from 'react';
import GraphVisualization from './GraphVisualization';
import SuggestionsList from './SuggestionList'; // Fixed import
import './GitHubPage.css';

const GitHubPage = () => {
  const [username, setUsername] = useState('');
  const [depth, setDepth] = useState(2);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleDepthChange = (e) => setDepth(e.target.value);

  const handleGenerateGraph = async () => {
    setLoading(true);
    setError(null);
    setGraphData(null);
    //setSuggestions(null);

    try {
      const response = await fetch('http://localhost:8000/api/github/graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, depth: parseInt(depth, 10) }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch graph data');
      }

      const data = await response.json();
      setGraphData(prepareGraphData(data));

      // Fetch suggestions
      const responseSuggestion = await fetch('http://localhost:8000/api/graph/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, depth: parseInt(depth, 10) }),
      });

      if (!responseSuggestion.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const suggestionData = await responseSuggestion.json();
      setSuggestions(suggestionData); // Assuming suggestionData is already an array
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
      if (Array.isArray(targets)) {
        targets.forEach((target) => {
          edges.push({ from: source, to: target });
        });
      } else if (typeof targets === 'object') {
        Object.keys(targets).forEach((nestedTarget) => {
          edges.push({ from: source, to: nestedTarget });
        });
      } else {
        console.warn(`Unexpected target type for source "${source}":`, targets);
      }
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
      
      {/* Render the suggestions list below the graph */}
      {suggestions.length > 0 && <SuggestionsList suggestions={suggestions} />}
    </div>
  );
};

export default GitHubPage;
