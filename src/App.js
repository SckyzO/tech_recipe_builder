import { useState } from 'react';
import { templates, templateCategories, testTableTemplate } from './data/templates.js';
import TemplatePanel from './components/TemplatePanel.js';
import RecipeEditor from './components/RecipeEditor.js';
import AsciiDocPreview from './components/AsciiDocPreview.js';

export default function App() {
  const [recipe, setRecipe] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [asciidocContent, setAsciidocContent] = useState('');
  const [expandedLeftCategory, setExpandedLeftCategory] = useState(null);
  const [expandedTemplateCategory, setExpandedTemplateCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedH2s, setCollapsedH2s] = useState([]);
  const [collapsedH3s, setCollapsedH3s] = useState([]);
  const [collapsedH4s, setCollapsedH4s] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');
  const [allSectionsCollapsed, setAllSectionsCollapsed] = useState(false);

  const toggleAllSections = () => {
    if (allSectionsCollapsed) {
      setCollapsedH2s([]);
      setCollapsedH3s([]);
      setCollapsedH4s([]);
      setAllSectionsCollapsed(false);
    } else {
      const h2Ids = recipe.map(cat => cat.id);
      const h3Ids = recipe.flatMap(cat => cat.subsections.map(sub => sub.id));
      const h4Ids = recipe.flatMap(cat => cat.subsections.flatMap(sub => sub.tests.map(test => test.instanceId)));
      setCollapsedH2s(h2Ids);
      setCollapsedH3s(h3Ids);
      setCollapsedH4s(h4Ids);
      setAllSectionsCollapsed(true);
    }
  };

  const handleDragStart = (e, item) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', JSON.stringify({ ...item, isReorder: true }));
    setDraggedItem({ ...item, isReorder: true });
  };

  const handleDragStartFromTemplates = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ ...item, isReorder: false }));
    setDraggedItem({ ...item, isReorder: false });
  };

  const handleTemplateClick = (item) => {
    const updatedRecipe = [...recipe];
    if (item.type === 'h2') {
      const newCategory = { id: crypto.randomUUID(), name: item.name, heading: item.heading, subsections: [] };
      updatedRecipe.push(newCategory);
      setCollapsedH2s(prev => [...prev, newCategory.id]);
    } else if (item.type === 'h3') {
      const lastCategoryIndex = updatedRecipe.length - 1;
      if (lastCategoryIndex >= 0) {
        const newSubsection = { id: crypto.randomUUID(), h3Heading: item.heading, tests: [] };
        updatedRecipe[lastCategoryIndex].subsections.push(newSubsection);
        setCollapsedH3s(prev => [...prev, newSubsection.id]);
      } else {
        const newSubsection = { id: crypto.randomUUID(), h3Heading: item.heading, tests: [] };
        const newCategory = { id: crypto.randomUUID(), name: 'Nouvelle Catégorie', heading: '== Nouvelle Catégorie', subsections: [newSubsection] };
        updatedRecipe.push(newCategory);
        setCollapsedH2s(prev => [...prev, newCategory.id]);
        setCollapsedH3s(prev => [...prev, newSubsection.id]);
      }
    } else if (item.type === 'test') {
      const lastCategoryIndex = updatedRecipe.length - 1;
      if (lastCategoryIndex >= 0) {
        const lastSubsectionIndex = updatedRecipe[lastCategoryIndex].subsections.length - 1;
        if (lastSubsectionIndex >= 0) {
          const newTest = { ...item, instanceId: crypto.randomUUID(), h4Heading: `==== ${item.name}` };
          updatedRecipe[lastCategoryIndex].subsections[lastSubsectionIndex].tests.push(newTest);
          setCollapsedH4s(prev => [...prev, newTest.instanceId]);
        } else {
          const newTest = { ...item, instanceId: crypto.randomUUID(), h4Heading: `==== ${item.name}` };
          const newSubsection = { id: crypto.randomUUID(), h3Heading: '=== Nouvelle Sous-section', tests: [newTest] };
          updatedRecipe[lastCategoryIndex].subsections.push(newSubsection);
          setCollapsedH3s(prev => [...prev, newSubsection.id]);
          setCollapsedH4s(prev => [...prev, newTest.instanceId]);
        }
      } else {
        const newTest = { ...item, instanceId: crypto.randomUUID(), h4Heading: `==== ${item.name}` };
        const newSubsection = { id: crypto.randomUUID(), h3Heading: '=== Nouvelle Sous-section', tests: [newTest] };
        const newCategory = { id: crypto.randomUUID(), name: 'Nouvelle Catégorie', heading: '== Nouvelle Catégorie', subsections: [newSubsection] };
        updatedRecipe.push(newCategory);
        setCollapsedH2s(prev => [...prev, newCategory.id]);
        setCollapsedH3s(prev => [...prev, newSubsection.id]);
        setCollapsedH4s(prev => [...prev, newTest.instanceId]);
      }
    }
    setRecipe(updatedRecipe);
  };

  const handleReorder = (e, dropTargetData) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
    let sourceData = null;
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (data) sourceData = JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
      setDraggedItem(null);
      return;
    }
    if (!sourceData || !sourceData.isReorder || sourceData.type !== dropTargetData.type) {
      setDraggedItem(null);
      return;
    }
    const newRecipe = JSON.parse(JSON.stringify(recipe));
    if (sourceData.type === 'h2') {
      const draggedIndex = newRecipe.findIndex(item => item.id === sourceData.id);
      const dropIndex = newRecipe.findIndex(item => item.id === dropTargetData.id);
      if (draggedIndex === dropIndex) return;
      const [reorderedItem] = newRecipe.splice(draggedIndex, 1);
      newRecipe.splice(dropIndex, 0, reorderedItem);
    }
    if (sourceData.type === 'h3' && sourceData.parentCategoryId === dropTargetData.parentCategoryId) {
      const parentCategory = newRecipe.find(cat => cat.id === sourceData.parentCategoryId);
      if (!parentCategory) return;
      const draggedIndex = parentCategory.subsections.findIndex(item => item.id === sourceData.id);
      const dropIndex = parentCategory.subsections.findIndex(item => item.id === dropTargetData.id);
      if (draggedIndex === dropIndex) return;
      const [reorderedItem] = parentCategory.subsections.splice(draggedIndex, 1);
      parentCategory.subsections.splice(dropIndex, 0, reorderedItem);
    }
    if (sourceData.type === 'test' && sourceData.parentCategoryId === dropTargetData.parentCategoryId && sourceData.parentH3Id === dropTargetData.parentH3Id) {
      const parentCategory = newRecipe.find(cat => cat.id === sourceData.parentCategoryId);
      if (!parentCategory) return;
      const parentSubsection = parentCategory.subsections.find(sub => sub.id === sourceData.parentH3Id);
      if (!parentSubsection) return;
      const draggedIndex = parentSubsection.tests.findIndex(item => item.instanceId === sourceData.id);
      const dropIndex = parentSubsection.tests.findIndex(item => item.instanceId === dropTargetData.id);
      if (draggedIndex === dropIndex) return;
      const [reorderedItem] = parentSubsection.tests.splice(draggedIndex, 1);
      parentSubsection.tests.splice(dropIndex, 0, reorderedItem);
    }
    setRecipe(newRecipe);
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem) {
      e.currentTarget.classList.add('border-purple-400', 'bg-purple-50');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
  };

  const handleDropNew = (e, dropTarget = null) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
    let sourceData = null;
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (data) sourceData = JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse dropped data:", error);
      return;
    }
    if (!sourceData || sourceData.isReorder) return;
    handleTemplateClick(sourceData);
    setDraggedItem(null);
  };

  const handleCategoryHeadingChange = (categoryId, value) => {
    setRecipe(recipe.map(category => category.id === categoryId ? { ...category, heading: value } : category));
  };

  const handleH3HeadingChange = (categoryId, h3Id, newH3Heading) => {
    setRecipe(recipe.map(category => category.id === categoryId ? { ...category, subsections: category.subsections.map(sub => sub.id === h3Id ? { ...sub, h3Heading: newH3Heading } : sub) } : category));
  };

  const handleTestHeadingChange = (categoryId, h3Id, instanceId, value) => {
    setRecipe(recipe.map(category => category.id === categoryId ? { ...category, subsections: category.subsections.map(sub => sub.id === h3Id ? { ...sub, tests: sub.tests.map(test => test.instanceId === instanceId ? { ...test, h4Heading: value } : test) } : sub) } : category));
  };

  const handleContentChange = (categoryId, h3Id, instanceId, field, value) => {
    setRecipe(recipe.map(category => category.id === categoryId ? { ...category, subsections: category.subsections.map(sub => sub.id === h3Id ? { ...sub, tests: sub.tests.map(test => test.instanceId === instanceId ? { ...test, fields: { ...test.fields, [field]: value } } : test) } : sub) } : category));
  };

  const removeTest = (categoryId, h3Id, instanceId) => {
    setRecipe(recipe.reduce((acc, category) => {
      if (category.id === categoryId) {
        const updatedSubsections = category.subsections.reduce((subAcc, sub) => {
          if (sub.id === h3Id) {
            const remainingTests = sub.tests.filter(test => test.instanceId !== instanceId);
            if (remainingTests.length > 0) subAcc.push({ ...sub, tests: remainingTests });
          } else {
            subAcc.push(sub);
          }
          return subAcc;
        }, []);
        if (updatedSubsections.length > 0) acc.push({ ...category, subsections: updatedSubsections });
      } else {
        acc.push(category);
      }
      return acc;
    }, []));
  };

  const removeSection = (categoryId) => {
    setRecipe(recipe.filter(category => category.id !== categoryId));
  };

  const removeSubsection = (categoryId, h3Id) => {
    setRecipe(recipe.map(category => category.id === categoryId ? { ...category, subsections: category.subsections.filter(sub => sub.id !== h3Id) } : category).filter(category => category.subsections.length > 0 || category.heading));
  };

  const generateAsciidoc = () => {
    let finalContent = '';
    recipe.forEach(category => {
      if (category.heading) finalContent += category.heading + '\n\n';
      category.subsections.forEach(subsection => {
        if (subsection.h3Heading) finalContent += subsection.h3Heading + '\n\n';
        subsection.tests.forEach(test => {
          if (test.h4Heading) finalContent += test.h4Heading + '\n\n';
          let contentWithVariables = testTableTemplate;
          for (const field in test.fields) {
            contentWithVariables = contentWithVariables.replace(new RegExp(`{${field}}`, 'g'), test.fields[field]);
          }
          finalContent += contentWithVariables + '\n\n';
        });
      });
    });
    setAsciidocContent(finalContent.trim());
  };

  const handleCopy = async () => {
    if (!asciidocContent) return;
    try {
      await navigator.clipboard.writeText(asciidocContent);
      setCopyMessage('Copié dans le presse-papiers !');
      setTimeout(() => setCopyMessage(''), 3000);
    } catch (err) {
      console.error('Échec de la copie via l\'API du presse-papiers, tentative de la méthode de secours.', err);
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = asciidocContent;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      setCopyMessage('Copié dans le presse-papiers (méthode de secours) !');
      setTimeout(() => setCopyMessage(''), 3000);
    }
  };

  const handleAddAllTemplates = () => {
    const newRecipe = [];
    const newCollapsedH2s = [];
    const newCollapsedH3s = [];
    const newCollapsedH4s = [];
    templateCategories.forEach(category => {
      const newCategory = { id: crypto.randomUUID(), name: category.name, heading: `== ${category.name}`, subsections: [] };
      newRecipe.push(newCategory);
      newCollapsedH2s.push(newCategory.id);
      const newSubsection = { id: crypto.randomUUID(), h3Heading: `=== ${category.name}`, tests: [] };
      newCategory.subsections.push(newSubsection);
      newCollapsedH3s.push(newSubsection.id);
      category.templates.forEach(template => {
        const newTest = { ...template, instanceId: crypto.randomUUID(), h4Heading: `==== ${template.name}` };
        newSubsection.tests.push(newTest);
        newCollapsedH4s.push(newTest.instanceId);
      });
    });
    setRecipe(newRecipe);
    setCollapsedH2s(newCollapsedH2s);
    setCollapsedH3s(newCollapsedH3s);
    setCollapsedH4s(newCollapsedH4s);
    setAllSectionsCollapsed(true);
  };

  const handleRemoveAllTemplates = () => {
    setRecipe([]);
    setCollapsedH2s([]);
    setCollapsedH3s([]);
    setCollapsedH4s([]);
    setAllSectionsCollapsed(false);
  };

  const toggleH2Collapse = (categoryId) => setCollapsedH2s(prev => prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]);
  const toggleH3Collapse = (h3Id) => setCollapsedH3s(prev => prev.includes(h3Id) ? prev.filter(id => id !== h3Id) : [...prev, h3Id]);
  const toggleH4Collapse = (instanceId) => setCollapsedH4s(prev => prev.includes(instanceId) ? prev.filter(id => id !== instanceId) : [...prev, instanceId]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 p-4 lg:p-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Générateur de Fiches de Test
      </h1>
      <div className="flex-grow flex flex-col lg:flex-row gap-6">
        <TemplatePanel
          templates={templates}
          templateCategories={templateCategories}
          handleAddAllTemplates={handleAddAllTemplates}
          handleRemoveAllTemplates={handleRemoveAllTemplates}
          toggleAllSections={toggleAllSections}
          allSectionsCollapsed={allSectionsCollapsed}
          expandedLeftCategory={expandedLeftCategory}
          setExpandedLeftCategory={setExpandedLeftCategory}
          handleTemplateClick={handleTemplateClick}
          handleDragStartFromTemplates={handleDragStartFromTemplates}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          toggleExpandedTemplateCategory={setExpandedTemplateCategory}
          expandedTemplateCategory={expandedTemplateCategory}
        />
        <div className="w-full lg:w-3/4 flex flex-col">
          <RecipeEditor
            recipe={recipe}
            handleDropNew={handleDropNew}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDragStart={handleDragStart}
            handleReorder={handleReorder}
            handleCategoryHeadingChange={handleCategoryHeadingChange}
            toggleH2Collapse={toggleH2Collapse}
            isH2Collapsed={(id) => collapsedH2s.includes(id)}
            removeSection={removeSection}
            handleH3HeadingChange={handleH3HeadingChange}
            toggleH3Collapse={toggleH3Collapse}
            isH3Collapsed={(id) => collapsedH3s.includes(id)}
            removeSubsection={removeSubsection}
            handleTestHeadingChange={handleTestHeadingChange}
            toggleH4Collapse={toggleH4Collapse}
            isH4Collapsed={(id) => collapsedH4s.includes(id)}
            removeTest={removeTest}
            handleContentChange={handleContentChange}
          />
          <AsciiDocPreview
            generateAsciidoc={generateAsciidoc}
            handleCopy={handleCopy}
            asciidocContent={asciidocContent}
            copyMessage={copyMessage}
          />
        </div>
      </div>
    </div>
  );
}