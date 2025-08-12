import React from 'react';

// Composant pour un éditeur de bloc de code
function CodeEditor({ content, onChange }) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      rows="5"
      className="w-full font-mono text-sm p-2 bg-gray-50 rounded border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}

export default CodeEditor;
