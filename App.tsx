import React, { useState, useEffect, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import LoadingSpinner from './components/LoadingSpinner';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import { startGame, sendChoice, finalizeCharacter, focusOnPoint, combineFragments } from './services/geminiService';
import { GameStatus } from './types';
import type { GameState, Scene } from './types';
import { INITIAL_GAME_STATE, SAVE_GAME_KEY } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MainMenu);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSaveData, setHasSaveData] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(SAVE_GAME_KEY);
      setHasSaveData(!!savedGame);
    } catch (e) {
      console.error("Could not check for saved game:", e);
      setHasSaveData(false);
    }
  }, []);

  const handleNewGame = useCallback(async () => {
    setStatus(GameStatus.Loading);
    setError(null);
    try {
      const response = await startGame();
      if (response) {
        setGameState(response.updatedState);
        setScene(response.scene);
        setStatus(GameStatus.CharacterCreation);
      } else {
        throw new Error("Không thể bắt đầu trò chơi. Phản hồi từ AI không hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
      setStatus(GameStatus.Error);
    }
  }, []);
  
  const handleLoadGame = useCallback(() => {
    try {
      const savedGameJSON = localStorage.getItem(SAVE_GAME_KEY);
      if (savedGameJSON) {
        const savedGame = JSON.parse(savedGameJSON);
        setGameState(savedGame.gameState);
        setScene(savedGame.scene);
        setStatus(GameStatus.Playing);
      }
    } catch (e) {
      console.error("Failed to load game:", e);
      setError("Không thể tải trò chơi đã lưu. Dữ liệu có thể đã bị hỏng.");
      setStatus(GameStatus.Error);
      localStorage.removeItem(SAVE_GAME_KEY);
      setHasSaveData(false);
    }
  }, []);

  const handleSaveGame = useCallback(() => {
    if (gameState && scene) {
      try {
        const gameData = JSON.stringify({ gameState, scene });
        localStorage.setItem(SAVE_GAME_KEY, gameData);
        alert("Đã lưu trò chơi!");
        setHasSaveData(true);
      } catch (e) {
        console.error("Failed to save game:", e);
        alert("Lưu trò chơi thất bại!");
      }
    }
  }, [gameState, scene]);
  
  const handleQuitGame = () => {
    setGameState(null);
    setScene(null);
    setStatus(GameStatus.MainMenu);
  };

  const handleCharacterFinalized = useCallback(async (characterData: Omit<GameState, 'playerStats' | 'relationships' | 'inventory' | 'storyFlags' | 'currentSceneId' | 'journal' | 'mentalState' | 'mentalStateDescription' | 'memoryFragments' | 'hubActionsRemaining'>) => {
    setStatus(GameStatus.Loading);
    setError(null);

    const updatedState: GameState = {
      ...INITIAL_GAME_STATE,
      ...characterData,
    };

    // Apply stat bonuses based on choices
    switch (characterData.playerMotivation) {
      case "Tìm kiếm sự khởi đầu mới":
      case "Bị cuốn hút bởi những điều bí ẩn":
        updatedState.playerStats.investigation += 1;
        break;
      case "Theo gia đình chuyển đến":
        updatedState.playerStats.social += 1;
        break;
      case "Nghe nói về những câu chuyện ma ở đây":
        updatedState.playerStats.supernatural += 1;
        break;
    }
     switch (characterData.playerSkill) {
      case "Khả năng quan sát tinh tường":
        updatedState.playerStats.investigation += 1;
        break;
      case "Kiến thức rộng về văn hóa dân gian/truyền thuyết":
        updatedState.playerStats.supernatural += 1;
        break;
      case "Kỹ năng giao tiếp tốt":
        updatedState.playerStats.social += 1;
        break;
    }

    // Apply stat bonuses from tendencies
    if (characterData.playerTendencies.approach === 'analysis') {
      updatedState.playerStats.investigation += 1;
    }
    if (characterData.playerTendencies.social === 'extrovert') {
      updatedState.playerStats.social += 1;
    }
    if (characterData.playerTendencies.supernatural === 'believer') {
      updatedState.playerStats.supernatural += 1;
    }


    setGameState(updatedState);

    try {
      const response = await finalizeCharacter(updatedState);
      if (response) {
        setGameState(response.updatedState);
        setScene(response.scene);
        setStatus(GameStatus.Playing);
      } else {
        throw new Error("Phản hồi từ AI không hợp lệ sau khi tạo nhân vật.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
      setStatus(GameStatus.Error);
    }
  }, []);


  const handleChoice = useCallback(async (choiceId: string) => {
    if (!gameState) return;
    setStatus(GameStatus.Loading);
    setError(null);

    // Add player's choice to the dialogue history for immediate feedback
    if (scene && gameState) {
        const chosenChoice = scene.choices.find(c => c.id === choiceId);
        if (chosenChoice) {
            const playerActionFeedback = { character: 'System', line: `[Bạn quyết định: ${chosenChoice.text}]` };
            setScene(prevScene => prevScene ? {...prevScene, dialogue: [...prevScene.dialogue, playerActionFeedback], choices: []} : null);
        }
    }


    try {
      const response = await sendChoice(choiceId, gameState);
      if (response) {
        setGameState(response.updatedState);
        setScene(response.scene);
        setStatus(GameStatus.Playing);
      } else {
        throw new Error("Phản hồi từ AI không hợp lệ. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
      setStatus(GameStatus.Error);
    }
  }, [gameState, scene]);
  
  const handleFocusOnPoint = useCallback(async (focusId: string) => {
    if (!gameState) return;
    setStatus(GameStatus.Loading);
    setError(null);
    try {
      const response = await focusOnPoint(focusId, gameState);
      if (response) {
        setGameState(response.updatedState);
        setScene(response.scene);
        setStatus(GameStatus.Playing);
      } else {
        throw new Error("Phản hồi từ AI không hợp lệ. Vui lòng thử lại.");
      }
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
        setStatus(GameStatus.Error);
    }
  }, [gameState]);

  const handleCombineFragments = useCallback(async (fragmentIds: string[]) => {
    if (!gameState) return;
    setStatus(GameStatus.Loading);
    setError(null);
    try {
      const response = await combineFragments(fragmentIds, gameState);
      if (response) {
        setGameState(response.updatedState);
        setScene(response.scene);
        setStatus(GameStatus.Playing);
      } else {
        throw new Error("Phản hồi từ AI không hợp lệ. Vui lòng thử lại.");
      }
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
        setStatus(GameStatus.Error);
    }
  }, [gameState]);


  const renderContent = () => {
    switch (status) {
      case GameStatus.MainMenu:
        return <MainMenu onNewGame={handleNewGame} onLoadGame={handleLoadGame} hasSaveData={hasSaveData} />;
      case GameStatus.Loading:
        return <LoadingSpinner />;
      case GameStatus.CharacterCreation:
        if (scene) {
          return <CharacterCreationScreen prologueDescription={scene.description} onConfirm={handleCharacterFinalized} />;
        }
        // Fallthrough to error if scene is null
      case GameStatus.Playing:
        if (scene && gameState) {
          return <GameScreen 
                    scene={scene} 
                    gameState={gameState}
                    onChoice={handleChoice} 
                    onFocusOnPoint={handleFocusOnPoint}
                    onCombineFragments={handleCombineFragments}
                    onSave={handleSaveGame} 
                    onQuit={handleQuitGame} 
                 />;
        }
        // Fallthrough to error if scene or gameState is null
      case GameStatus.Error:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
            <h2 className="text-3xl text-red-500 mb-4">Đã xảy ra lỗi</h2>
            <p className="text-gray-300 mb-8 max-w-md text-center">{error || "An unknown error occurred."}</p>
            <button
              onClick={() => setStatus(GameStatus.MainMenu)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg"
            >
              Quay về Menu Chính
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;
