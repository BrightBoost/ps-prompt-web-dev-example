import React from 'react';
import { Clock, GripVertical } from 'lucide-react';

const ResourceCard = ({ resource, handleDragStart, typeIcons }) => {
    const IconComponent = typeIcons[resource.type];
    // Color indicator for time status
    let timeColor = 'bg-gray-200';
    if (resource.actualTime > 0) {
        const estMin = resource.estimatedTime ? parseInt(resource.estimatedTime) : 0;
        if (resource.actualTime <= estMin) timeColor = 'bg-green-200';
        else timeColor = 'bg-red-200';
    }

    // Timer controls
    const timerActive = resource.timerActive;
    // Format minutes to h:mm
    const formatMin = (min) => {
        if (!min || min < 1) return '0m';
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h ? h + 'h ' : ''}${m}m`;
    };

    // Estimate editing
    const [editMode, setEditMode] = React.useState(false);
    const [estimateInput, setEstimateInput] = React.useState(resource.estimatedTime);

    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, resource)}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-move hover:shadow-md transition-shadow duration-200 group ${timeColor}`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1">
                    <IconComponent className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">{resource.title}</h3>
                </div>
                <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
            </div>
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">{resource.description}</p>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                    {resource.type}
                </span>
                <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {editMode ? (
                        <>
                            <input
                                value={estimateInput}
                                onChange={e => setEstimateInput(e.target.value)}
                                className="border px-1 py-0.5 text-xs rounded"
                            />
                            <button onClick={() => { setEditMode(false); resource.onEditEstimate(resource.id, estimateInput); }} className="ml-1 text-green-600">Save</button>
                            <button onClick={() => { setEditMode(false); setEstimateInput(resource.estimatedTime); }} className="ml-1 text-gray-400">Cancel</button>
                        </>
                    ) : (
                        <>
                            {resource.estimatedTime}
                            <button onClick={() => setEditMode(true)} className="ml-2 text-blue-500 text-xs">Edit</button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    Actual: {formatMin(resource.actualTime)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${resource.actualTime > 0 && resource.actualTime <= parseInt(resource.estimatedTime) ? 'bg-green-300 text-green-800' : resource.actualTime > parseInt(resource.estimatedTime) ? 'bg-red-300 text-red-800' : 'bg-gray-200 text-gray-600'}`}>
                    {resource.actualTime > 0 ? (resource.actualTime <= parseInt(resource.estimatedTime) ? 'On Track' : 'Over Time') : 'Not Started'}
                </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
                {timerActive ? (
                    <button onClick={() => resource.onStopTimer(resource.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">Stop Timer</button>
                ) : (
                    <button onClick={() => resource.onStartTimer(resource.id)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Start Timer</button>
                )}
            </div>
            {resource.sessions && resource.sessions.length > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                    <div>Sessions:</div>
                    <ul>
                        {resource.sessions.map((s, i) => (
                            <li key={i}>Session {i + 1}: {formatMin(s.duration)}</li>
                        ))}
                    </ul>
                </div>
            )}
            {resource.estimateLog && resource.estimateLog.length > 1 && (
                <div className="text-xs text-gray-400 mt-2">
                    <div>Estimate Changes:</div>
                    <ul>
                        {resource.estimateLog.map((log, i) => (
                            <li key={i}>{log.value} ({new Date(log.timestamp).toLocaleString()})</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ResourceCard;
