import React, { useState } from 'react';
import type { JournalEntry, MemoryFragment, InventoryItem } from '../../types';

interface JournalModalProps {
    journalEntries: JournalEntry[];
    memoryFragments: MemoryFragment[];
    inventory: InventoryItem[];
    onClose: () => void;
    onCombine: (fragmentIds: string[]) => void;
}

const JournalModal: React.FC<JournalModalProps> = ({ journalEntries, memoryFragments, inventory, onClose, onCombine }) => {
    const [activeTab, setActiveTab] = useState<'journal' | 'fragments' | 'inventory'>('journal');
    const [selectedFragments, setSelectedFragments] = useState<Set<string>>(new Set());

    const toggleFragmentSelection = (id: string) => {
        setSelectedFragments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCombineClick = () => {
        if (selectedFragments.size > 1) {
            onCombine(Array.from(selectedFragments));
            setSelectedFragments(new Set());
            onClose();
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 border border-red-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex border-b border-gray-700">
                    <button 
                        onClick={() => setActiveTab('journal')}
                        className={`flex-1 text-xl md:text-2xl font-serif-display p-4 transition-colors ${activeTab === 'journal' ? 'text-red-500 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Nhật Ký
                    </button>
                    <button 
                        onClick={() => setActiveTab('fragments')}
                        className={`flex-1 text-xl md:text-2xl font-serif-display p-4 transition-colors ${activeTab === 'fragments' ? 'text-red-500 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Ký Ức
                    </button>
                     <button 
                        onClick={() => setActiveTab('inventory')}
                        className={`flex-1 text-xl md:text-2xl font-serif-display p-4 transition-colors ${activeTab === 'inventory' ? 'text-red-500 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Vật Chứng
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 flex-grow">
                    {activeTab === 'journal' && (
                        journalEntries.length > 0 ? journalEntries.map(entry => (
                            <div key={entry.id} className={`p-4 rounded-md ${entry.isCorrupted ? 'bg-red-900 bg-opacity-30 border-l-4 border-red-500' : 'bg-gray-800'}`}>
                                <h3 className="font-bold text-lg text-gray-200">{entry.title}</h3>
                                <p className={`text-gray-400 whitespace-pre-wrap mt-2 ${entry.isCorrupted ? 'italic text-red-300' : ''}`}>{entry.content}</p>
                            </div>
                        )).reverse() : <p className="text-gray-500 italic text-center">Chưa có ký ức nào được ghi lại.</p>
                    )}
                    {activeTab === 'fragments' && (
                        memoryFragments.length > 0 ? memoryFragments.map(fragment => (
                            <div 
                                key={fragment.id} 
                                onClick={() => toggleFragmentSelection(fragment.id)}
                                className={`p-4 rounded-md cursor-pointer transition-all ${selectedFragments.has(fragment.id) ? 'bg-blue-900 bg-opacity-50 border-l-4 border-blue-400' : 'bg-gray-800 hover:bg-gray-700'}`}
                            >
                                <h3 className="font-bold text-lg text-blue-300">{fragment.name}</h3>
                                <p className="text-gray-400 italic mt-1">{fragment.description}</p>
                            </div>
                        )) : <p className="text-gray-500 italic text-center">Chưa thu thập được mảnh vỡ ký ức nào.</p>
                    )}
                    {activeTab === 'inventory' && (
                        inventory.length > 0 ? inventory.map(item => (
                            <div 
                                key={item.id} 
                                className="p-4 rounded-md bg-gray-800"
                            >
                                <h3 className="font-bold text-lg text-green-300">{item.name}</h3>
                                <p className="text-gray-400 italic mt-1">{item.description}</p>
                            </div>
                        )) : <p className="text-gray-500 italic text-center">Túi đồ trống.</p>
                    )}
                </div>
                
                <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                    {activeTab === 'fragments' && (
                        <button 
                            onClick={handleCombineClick} 
                            disabled={selectedFragments.size < 2}
                            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Kết hợp ({selectedFragments.size})
                        </button>
                    )}
                    <button onClick={onClose} className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition ml-auto">Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default JournalModal;