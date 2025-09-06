import React from 'react';
import { Clock, GripVertical } from 'lucide-react';

const ResourceCard = ({ resource, handleDragStart, typeIcons }) => {
    const IconComponent = typeIcons[resource.type];
    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, resource)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow duration-200 group"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1">
                    <IconComponent className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">{resource.title}</h3>
                </div>
                <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
            </div>
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">{resource.description}</p>
            <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                    {resource.type}
                </span>
                <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {resource.estimatedTime}
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
