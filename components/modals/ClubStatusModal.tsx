import React from 'react';
import type { Relationships } from '../../types';

interface ClubStatusModalProps {
    relationships: Relationships;
    knownCharacters: string[];
    onClose: () => void;
}

const CHARACTER_NAMES: { [key: string]: string } = {
    ohJihye: 'Oh Ji-hye',
    kimHyunwoo: 'Kim Hyun-woo',
    leeSoyeon: 'Lee So-yeon',
};

const getRelationshipText = (score: number): string => {
    if (score > 75) return 'Cực kỳ thân thiết';
    if (score > 50) return 'Tin tưởng';
    if (score > 25) return 'Thân thiện';
    if (score < 0) return 'Nghi ngờ';
    return 'Người quen';
};

const ClubStatusModal: React.FC<ClubStatusModalProps> = ({ relationships, knownCharacters, onClose }) => (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <div 
            className="bg-gray-900 border border-blue-800 rounded-lg shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-3xl font-serif-display text-blue-400 p-4 border-b border-gray-700">Thành Viên Câu Lạc Bộ</h2>
            <div className="p-6 space-y-4">
                {knownCharacters.length > 0 ? (
                    knownCharacters.map(charId => (
                        <div key={charId} className="flex justify-between items-center">
                            <span className="text-xl text-gray-200">{CHARACTER_NAMES[charId] || charId}:</span>
                            <span className="text-lg text-blue-300 font-semibold">{getRelationshipText(relationships[charId] ?? 0)}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic text-center">Bạn chưa chính thức làm quen với thành viên nào.</p>
                )}
            </div>
            <div className="p-4 border-t border-gray-700 text-right">
                <button onClick={onClose} className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">Đóng</button>
            </div>
        </div>
    </div>
);

export default ClubStatusModal;