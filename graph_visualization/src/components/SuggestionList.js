// SuggestionsList.js
import React from 'react';
import './SuggestionList.css';

const SuggestionsList = ({ suggestions }) => {
  return (
    <div className="suggestions-list">
      <h2>Suggestions</h2>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsList;
