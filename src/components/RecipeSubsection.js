import React from 'react';
import TestCard from './TestCard';

function RecipeSubsection({ category, subsection, handleDragStart, handleReorder, handleH3HeadingChange, toggleH3Collapse, isH3Collapsed, removeSubsection, ...props }) {
  return (
    <div
      key={subsection.id}
      className={`bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200 transition-all duration-300 ${isH3Collapsed(subsection.id) ? 'opacity-70' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleReorder(e, { id: subsection.id, type: 'h3', parentCategoryId: category.id })}
    >
      <div className="flex items-center justify-between">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, { id: subsection.id, type: 'h3', parentCategoryId: category.id })}
          className="p-2 cursor-grab text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
          title="Déplacer cette sous-section"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 4H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input
          type="text"
          value={subsection.h3Heading}
          onChange={(e) => handleH3HeadingChange(category.id, subsection.id, e.target.value)}
          className="text-xl font-bold w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-300 rounded-md"
        />
        <button onClick={() => toggleH3Collapse(subsection.id)} className="p-1 rounded-full hover:bg-gray-200 ml-2 text-gray-600">
          <svg className={`h-5 w-5 transform transition-transform duration-200 ${isH3Collapsed(subsection.id) ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button onClick={() => removeSubsection(category.id, subsection.id)} className="p-1 rounded-full hover:bg-red-200 ml-2 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {!isH3Collapsed(subsection.id) && (
        <div className="mt-4 border-l-2 border-gray-300 pl-4">
          {subsection.tests.map(test => (
            <TestCard key={test.instanceId} category={category} subsection={subsection} test={test} {...props} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeSubsection;
