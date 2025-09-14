import React from 'react';
import ResourceCard from './ResourceCard';

const Column = ({ title, status, resources, bgColor, handleDragOver, handleDrop, handleDragStart, typeIcons }) => (
    <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className={`${bgColor} px-4 py-3 rounded-t-lg border-b border-gray-200`}>
                <h2 className="font-semibold text-gray-800 text-sm flex items-center justify-between">
                    {title}
                    <span className="bg-white bg-opacity-80 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {resources.length}
                    </span>
                </h2>
            </div>
            <div
                data-testid={`column-${status}`}
                className="p-4 min-h-96"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
            >
                {resources.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                        Drop resources here
                    </div>
                ) : (
                    resources.map(resource => (
                        <ResourceCard
                            key={resource.id}
                            resource={{
                                ...resource,
                                onStartTimer: (id) => typeof window.onStartTimer === 'function' ? window.onStartTimer(id) : undefined,
                                onStopTimer: (id) => typeof window.onStopTimer === 'function' ? window.onStopTimer(id) : undefined,
                                onEditEstimate: (id, val) => typeof window.onEditEstimate === 'function' ? window.onEditEstimate(id, val) : undefined
                            }}
                            handleDragStart={handleDragStart}
                            typeIcons={typeIcons}
                        />
                    ))
                )}
            </div>
        </div>
    </div>
);

export default Column;
