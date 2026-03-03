import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';

const ManageHotspots = () => {
    const [hotspots] = useState([
        { id: 1, name: 'Central Station', risk: 'High', incidents: 145, lastUpdated: '2 hours ago' },
        { id: 2, name: 'North Market', risk: 'Medium', incidents: 89, lastUpdated: '5 hours ago' },
        { id: 3, name: 'West End Park', risk: 'Low', incidents: 12, lastUpdated: '1 day ago' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Hotspots</h1>
                    <p className="text-gray-400">Add, edit, or remove high-risk zones</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-neon-teal text-deep-navy font-bold rounded-xl hover:bg-white transition-colors shadow-lg shadow-neon-teal/20">
                    <Plus size={18} />
                    Add New Hotspot
                </button>
            </div>

            <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-400">Location Name</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Risk Level</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Incidents (Monthly)</th>
                            <th className="p-4 text-sm font-semibold text-gray-400">Last Updated</th>
                            <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {hotspots.map((hotspot) => (
                            <tr key={hotspot.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 text-neon-teal">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="font-medium text-white">{hotspot.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${hotspot.risk === 'High' ? 'bg-danger/10 text-danger border border-danger/20' :
                                            hotspot.risk === 'Medium' ? 'bg-warning/10 text-warning border border-warning/20' :
                                                'bg-safe/10 text-safe border border-safe/20'
                                        }`}>
                                        {hotspot.risk} Risk
                                    </span>
                                </td>
                                <td className="p-4 text-gray-300">{hotspot.incidents}</td>
                                <td className="p-4 text-gray-400 text-sm">{hotspot.lastUpdated}</td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-danger/10 text-gray-400 hover:text-danger transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageHotspots;
