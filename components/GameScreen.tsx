
import React, { useRef, useEffect, useState } from 'react';
import type { Scene, Dialogue, GameState } from '../types';
import JournalModal from './modals/JournalModal';
import ClubStatusModal from './modals/ClubStatusModal';

interface GameScreenProps {
  scene: Scene;
  gameState: GameState;
  onChoice: (choiceId: string) => void;
  onFocusOnPoint: (focusId: string) => void;
  onCombineFragments: (fragmentIds: string[]) => void;
  onSave: () => void;
  onQuit: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ scene, gameState, onChoice, onFocusOnPoint, onCombineFragments, onSave, onQuit }) => {
  const contentEndRef = useRef<HTMLDivElement>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [screenEffect, setScreenEffect] = useState('');

  useEffect(() => {
    contentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scene]);

  useEffect(() => {
    if (gameState.mentalState < 25) {
      setScreenEffect('screen-shake');
      // Remove the class after the animation finishes to allow it to be re-triggered
      const timer = setTimeout(() => setScreenEffect(''), 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.mentalState, scene.id]); // Re-trigger on scene change if state is still low

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
    {isJournalOpen && <JournalModal journalEntries={gameState.journal} memoryFragments={gameState.memoryFragments} inventory={gameState.inventory} onClose={() => setIsJournalOpen(false)} onCombine={onCombineFragments} />}
    {isClubModalOpen && <ClubStatusModal relationships={gameState.relationships} knownCharacters={gameState.knownCharacters} onClose={() => setIsClubModalOpen(false)} />}
    <div className={`bg-gray-900 text-white min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 ${screenEffect}`}>
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
        {gameState.storyFlags.clubJoined && (
            <button onClick={() => setIsClubModalOpen(true)} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition">Câu Lạc Bộ</button>
        )}
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