import React from 'react';

function TemplatePanel({
  templates,
  templateCategories,
  handleAddAllTemplates,
  handleRemoveAllTemplates,
  toggleAllSections,
  allSectionsCollapsed,
  expandedLeftCategory,
  setExpandedLeftCategory,
  handleTemplateClick,
  handleDragStartFromTemplates,
  searchTerm,
  setSearchTerm,
  toggleExpandedTemplateCategory,
  expandedTemplateCategory
}) {

  const filteredTemplates = templateCategories.flatMap(cat => cat.templates).filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const hasSearchResults = searchTerm && filteredTemplates.length > 0;
  const noSearchResults = searchTerm && filteredTemplates.length === 0;

  return (
    <div className="w-full lg:w-1/4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 lg:h-auto overflow-y-auto flex-shrink-0">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Modèles</h2>

      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-bold text-gray-900">Autogénération</h3>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleAddAllTemplates}
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors duration-200"
          >
            Ajouter tous les modèles
          </button>
          <button
            onClick={handleRemoveAllTemplates}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-red-600 transition-colors duration-200"
          >
            Supprimer tous les modèles
          </button>
          <button
            onClick={toggleAllSections}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-blue-600 transition-colors duration-200 mt-2"
          >
            {allSectionsCollapsed ? 'Déplier tout' : 'Replier tout'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedLeftCategory(expandedLeftCategory === 'empty-headings' ? null : 'empty-headings')}
            className="w-full text-left p-4 bg-purple-200 text-purple-800 font-bold flex justify-between items-center transition-colors duration-200 hover:bg-purple-300 focus:outline-none"
          >
            Modèles de Titres
            <svg className={`h-5 w-5 transform transition-transform duration-200 ${expandedLeftCategory === 'empty-headings' ? 'rotate-90' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          {expandedLeftCategory === 'empty-headings' && (
            <div className="bg-white border-l-2 border-purple-500">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  draggable
                  onDragStart={(e) => handleDragStartFromTemplates(e, template)}
                  className="flex items-center justify-between p-3 pl-6 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-gray-700 font-medium"
                >
                  <span>{template.name}</span>
                  <span className="text-purple-500 font-bold ml-2">+</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Rechercher des modèles..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {hasSearchResults && (
          <div className="bg-white p-4 rounded-lg shadow-inner border border-purple-200">
            <h4 className="font-semibold text-purple-700 mb-2">Résultats de la recherche :</h4>
            <div className="space-y-2">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  draggable
                  onDragStart={(e) => handleDragStartFromTemplates(e, template)}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors duration-200"
                >
                  <span>{template.name}</span>
                  <span className="text-purple-500 font-bold ml-2">+</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {noSearchResults && (
          <div className="p-4 text-center text-gray-500">
            Aucun résultat trouvé.
          </div>
        )}

        {templateCategories.map(category => (
          <div key={category.id} className="rounded-lg overflow-hidden">
            <button
              onClick={() => toggleExpandedTemplateCategory(category.id)}
              className="w-full text-left p-4 bg-purple-200 text-purple-800 font-bold flex justify-between items-center transition-colors duration-200 hover:bg-purple-300 focus:outline-none"
            >
              {category.name}
              <svg className={`h-5 w-5 transform transition-transform duration-200 ${expandedTemplateCategory === category.id ? 'rotate-90' : 'rotate-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            {expandedTemplateCategory === category.id && (
              <div className="bg-white border-l-2 border-purple-500">
                {category.templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    draggable
                    onDragStart={(e) => handleDragStartFromTemplates(e, template)}
                    className="flex items-center justify-between p-3 pl-6 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-gray-700"
                  >
                    <span>{template.name}</span>
                    <span className="text-purple-500 font-bold ml-2">+</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplatePanel;
