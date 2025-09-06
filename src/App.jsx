import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Video, FileText, Code } from 'lucide-react';
import Column from './components/Column';

const LearningPlanner = () => {
  // Add missing functions after refactor
  const addResource = () => {
    if (newResource.title.trim() && newResource.description.trim() && newResource.estimatedTime.trim()) {
      const resource = {
        id: Date.now(),
        ...newResource,
        status: 'to-learn'
      };
      setResources(prev => [...prev, resource]);
      setNewResource({ title: '', type: 'article', description: '', estimatedTime: '' });
      setShowForm(false);
    }
  };

  const handleDragStart = (e, resource) => {
    setDraggedItem(resource);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      setResources(prev =>
        prev.map(resource =>
          resource.id === draggedItem.id
            ? { ...resource, status: newStatus }
            : resource
        )
      );
    }
    setDraggedItem(null);
  };

  const getResourcesByStatus = (status) => {
    return resources.filter(resource => resource.status === status);
  };
  const [resources, setResources] = useState([]);

  // Load resources from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('learningResources');
    if (stored) {
      setResources(JSON.parse(stored));
    } else {
      // If no resources, initialize with default
      setResources([]);
      
    }
  }, []);

  // Save resources to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('learningResources', JSON.stringify(resources));
  }, [resources]);

  const [showForm, setShowForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'article',
    description: '',
    estimatedTime: ''
  });
  const [draggedItem, setDraggedItem] = useState(null);

  const typeIcons = {
    video: Video,
    article: FileText,
    tutorial: BookOpen,
    course: Code
  };

  // ...existing code...

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Planner</h1>
          <p className="text-gray-600">Organize your learning resources and track your progress</p>
        </div>

        {/* Add Resource Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Learning Resource</span>
          </button>
        </div>

        {/* Add Resource Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Resource</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter resource title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="course">Course</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                  placeholder="Brief description of the resource"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                <input
                  value={newResource.estimatedTime}
                  onChange={(e) => setNewResource({ ...newResource, estimatedTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2 hours, 30 minutes"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addResource}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Add Resource
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewResource({ title: '', type: 'article', description: '', estimatedTime: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Column
            title="To Learn"
            status="to-learn"
            resources={getResourcesByStatus('to-learn')}
            bgColor="bg-red-50"
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            typeIcons={typeIcons}
          />
          <Column
            title="In Progress"
            status="in-progress"
            resources={getResourcesByStatus('in-progress')}
            bgColor="bg-yellow-50"
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            typeIcons={typeIcons}
          />
          <Column
            title="Completed"
            status="completed"
            resources={getResourcesByStatus('completed')}
            bgColor="bg-green-50"
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            typeIcons={typeIcons}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{getResourcesByStatus('to-learn').length}</div>
              <div className="text-sm text-gray-600">To Learn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{getResourcesByStatus('in-progress').length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getResourcesByStatus('completed').length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanner;