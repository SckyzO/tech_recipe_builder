import React from 'react';
import CodeEditor from './CodeEditor';

function TestCard({ category, subsection, test, handleDragStart, handleReorder, handleTestHeadingChange, toggleH4Collapse, isH4Collapsed, removeTest, handleContentChange }) {
  return (
    <div
      key={test.instanceId}
      className={`bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200 transition-all duration-300 ${isH4Collapsed(test.instanceId) ? 'opacity-70' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleReorder(e, { id: test.instanceId, type: 'test', parentCategoryId: category.id, parentH3Id: subsection.id })}
    >
      <div className="flex items-center justify-between">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, { id: test.instanceId, type: 'test', parentCategoryId: category.id, parentH3Id: subsection.id })}
          className="p-2 cursor-grab text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
          title="Déplacer ce test"
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
          value={test.h4Heading}
          onChange={(e) => handleTestHeadingChange(category.id, subsection.id, test.instanceId, e.target.value)}
          className="text-lg font-bold w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-300 rounded-md"
        />
        <button onClick={() => toggleH4Collapse(test.instanceId)} className="p-1 rounded-full hover:bg-gray-200 ml-2 text-gray-600">
          <svg className={`h-5 w-5 transform transition-transform duration-200 ${isH4Collapsed(test.instanceId) ? 'rotate-180' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button onClick={() => removeTest(category.id, subsection.id, test.instanceId)} className="p-1 rounded-full hover:bg-red-200 ml-2 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {!isH4Collapsed(test.instanceId) && (
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <input
              type="text"
              value={test.fields.id}
              onChange={(e) => handleContentChange(category.id, subsection.id, test.instanceId, 'id', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Intitulé du test</label>
            <input
              type="text"
              value={test.fields.title}
              onChange={(e) => handleContentChange(category.id, subsection.id, test.instanceId, 'title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
           />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Périmètre</label>
            <input
              type="text"
              value={test.fields.scope}
              onChange={(e) => handleContentChange(category.id, subsection.id, test.instanceId, 'scope', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Objectifs</label>
            <textarea
              value={test.fields.objective}
              onChange={(e) => handleContentChange(category.id, subsection.id, test.instanceId, 'objective', e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Opérations (code)</label>
            <CodeEditor
              content={test.fields.code_content}
              onChange={(value) => handleContentChange(category.id, subsection.id, test.instanceId, 'code_content', value)}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Résultat attendu</label>
            <textarea
              value={test.fields.expected_result}
              onChange={(e) => handleContentChange(category.id, subsection.id, test.instanceId, 'expected_result', e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TestCard;
