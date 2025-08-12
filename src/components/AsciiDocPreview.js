import React from 'react';

function AsciiDocPreview({ generateAsciidoc, handleCopy, asciidocContent, copyMessage }) {
  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={generateAsciidoc}
          className="w-full sm:w-1/2 bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
        >
          Générer l'aperçu AsciiDoc
        </button>
        <button
          onClick={handleCopy}
          disabled={!asciidocContent}
          title={!asciidocContent ? "Générez l'aperçu d'abord pour le copier" : 'Copier dans le presse-papiers'}
          className={`w-full sm:w-1/2 font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform ${asciidocContent ? 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:scale-105' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Copier l'aperçu dans le presse-papiers
        </button>
      </div>
      
      {copyMessage && (
        <div className="mt-4 p-3 bg-green-500 text-white rounded-lg shadow-md text-center">
          {copyMessage}
        </div>
      )}

      {asciidocContent && (
        <div className="relative mt-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">Aperçu AsciiDoc</h3>
          <textarea
            readOnly
            value={asciidocContent}
            className="w-full h-80 p-4 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none"
            placeholder="Cliquez sur 'Générer l'aperçu AsciiDoc' pour voir le contenu ici..."
          />
        </div>
      )}
    </div>
  );
}

export default AsciiDocPreview;
