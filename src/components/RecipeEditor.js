import React from 'react';
import RecipeSection from './RecipeSection';

function RecipeEditor({ recipe, handleDropNew, handleDragOver, handleDragLeave, ...props }) {
  return (
    <div
      className="w-full lg:w-3/4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropNew}
    >
      <div className="flex-grow overflow-y-auto">
        {recipe.length > 0 ? (
          recipe.map(category => (
            <RecipeSection key={category.id} category={category} {...props} />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-lg">
            Faites glisser-déposer des modèles ici pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeEditor;
