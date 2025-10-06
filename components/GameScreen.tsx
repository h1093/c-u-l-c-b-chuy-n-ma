import React, { useRef, useEffect, useState } from 'react';
import type { Scene, Dialogue, JournalEntry, Relationships, MemoryFragment, FocusPoint, GameState } from '../types';

interface GameScreenProps {
  scene: Scene;
  gameState: GameState;
  onChoice: (choiceId: string) => void;
  onFocusOnPoint: (focusId: string) => void;
  onCombineFragments: (fragmentIds: string[]) => void;
  onSave: () => void;
  onQuit: () => void;
}

const JournalModal: React.FC<{ 
    journalEntries: JournalEntry[], 
    memoryFragments: MemoryFragment[],
    onClose: () => void,
    onCombine: (fragmentIds: string[]) => void
}> = ({ journalEntries, memoryFragments, onClose, onCombine }) => {
    const [activeTab, setActiveTab] = useState<'journal' | 'fragments'>('journal');
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
                        className={`flex-1 text-2xl font-serif-display p-4 transition-colors ${activeTab === 'journal' ? 'text-red-500 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Nhật Ký
                    </button>
                    <button 
                        onClick={() => setActiveTab('fragments')}
                        className={`flex-1 text-2xl font-serif-display p-4 transition-colors ${activeTab === 'fragments' ? 'text-red-500 bg-gray-800' : 'text-gray-400 hover:bg-gray-800'}`}
                    >
                        Mảnh Vỡ Ký Ức
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


const getRelationshipText = (score: number): string => {
    if (score > 75) return 'Cực kỳ thân thiết';
    if (score > 50) return 'Tin tưởng';
    if (score > 25) return 'Thân thiện';
    if (score < 0) return 'Nghi ngờ';
    return 'Người quen';
};

const ClubStatusModal: React.FC<{ relationships: Relationships, onClose: () => void }> = ({ relationships, onClose }) => (
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
                <div className="flex justify-between items-center">
                    <span className="text-xl text-gray-200">Oh Ji-hye:</span>
                    <span className="text-lg text-blue-300 font-semibold">{getRelationshipText(relationships.ohJihye)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xl text-gray-200">Kim Hyun-woo:</span>
                    <span className="text-lg text-blue-300 font-semibold">{getRelationshipText(relationships.kimHyunwoo)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xl text-gray-200">Lee So-yeon:</span>
                    <span className="text-lg text-blue-300 font-semibold">{getRelationshipText(relationships.leeSoyeon)}</span>
                </div>
            </div>
            <div className="p-4 border-t border-gray-700 text-right">
                <button onClick={onClose} className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">Đóng</button>
            </div>
        </div>
    </div>
);


const GameScreen: React.FC<GameScreenProps> = ({ scene, gameState, onChoice, onFocusOnPoint, onCombineFragments, onSave, onQuit }) => {
  const contentEndRef = useRef<HTMLDivElement>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);

  useEffect(() => {
    contentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scene]);

  const renderDialogue = (dialogue: Dialogue, index: number) => {
    const isSystem = dialogue.character.toLowerCase() === 'system';
    const isPlayer = dialogue.character === gameState.playerName;

    if (isSystem) {
      return (
        <p key={index} className="text-gray-400 italic my-4 px-4 text-center">
          {dialogue.line}
        </p>
      );
    }

    if(isPlayer) {
         return (
             <div key={index} className="flex justify-end my-2">
                <div className="bg-blue-800 bg-opacity-40 rounded-lg p-3 max-w-[80%]">
                    <p className="text-blue-200">
                        <span className="font-bold">{dialogue.character}:</span> {dialogue.line}
                    </p>
                </div>
             </div>
         )
    }

    return (
        <div key={index} className="flex justify-start my-2">
            <div className="bg-gray-700 bg-opacity-40 rounded-lg p-3 max-w-[80%]">
                <p className="text-gray-200">
                    <span className="font-bold text-red-400">{dialogue.character}:</span> {dialogue.line}
                </p>
            </div>
        </div>
    );
  };


  return (
    <>
    {isJournalOpen && <JournalModal journalEntries={gameState.journal} memoryFragments={gameState.memoryFragments} onClose={() => setIsJournalOpen(false)} onCombine={onCombineFragments} />}
    {isClubModalOpen && <ClubStatusModal relationships={gameState.relationships} onClose={() => setIsClubModalOpen(false)} />}
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8">
      <div className="absolute top-4 left-4 flex space-x-4">
        <div className="bg-black bg-opacity-50 p-2 rounded-lg">
            <p className="text-gray-300">Trạng thái: <span className="font-bold text-red-400">{gameState.mentalStateDescription}</span></p>
        </div>
        {gameState.hubActionsRemaining > 0 && (
          <div className="bg-black bg-opacity-50 p-2 rounded-lg">
            <p className="text-gray-300">Lượt hành động: <span className="font-bold text-blue-400">{gameState.hubActionsRemaining}</span></p>
          </div>
        )}
      </div>
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={() => setIsClubModalOpen(true)} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition">Câu Lạc Bộ</button>
        <button onClick={() => setIsJournalOpen(true)} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition">Nhật Ký</button>
        <button onClick={onSave} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition">Lưu</button>
        <button onClick={onQuit} className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition">Thoát</button>
      </div>

      <div className="flex-grow overflow-y-auto pb-8 max-w-3xl mx-auto w-full pt-20">
        <div className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap font-serif-display mb-6 p-4 bg-black bg-opacity-20 rounded-lg">
          {scene.description}
        </div>
        <div className="space-y-2">
          {scene.dialogue.map(renderDialogue)}
        </div>
        <div ref={contentEndRef} />
      </div>

      <div className="flex-shrink-0 pt-6 max-w-3xl mx-auto w-full">
        {scene.focusPoints && scene.focusPoints.length > 0 && (
            <div className="mb-6">
                <h3 className="text-center text-lg text-blue-300 font-serif-display italic mb-3">Tập trung điều tra...</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scene.focusPoints.map((point) => (
                        <button
                            key={point.id}
                            onClick={() => onFocusOnPoint(point.id)}
                            className="w-full text-left p-3 bg-blue-900 bg-opacity-40 border border-blue-800 rounded-lg hover:bg-blue-800 hover:border-blue-600 transition-colors duration-200"
                        >
                            <p className="text-blue-200">{point.text}</p>
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scene.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice.id)}
              className="w-full text-left p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-red-900 hover:border-red-700 transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              <p className="text-gray-200">{choice.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default GameScreen;
