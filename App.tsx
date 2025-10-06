import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import LoadingSpinner from './components/LoadingSpinner';
import CharacterCreationScreen from './components/CharacterCreationScreen';
import ApiKeyPrompt from './components/ApiKeyPrompt';
import { getApiKey, setApiKey } from './services/apiKeyManager';
import { GameStatus } from './types';
import { useGameState } from './hooks/useGameState';

const App: React.FC = () => {
    const [apiKey, setApiKeyState] = useState<string | undefined>(getApiKey());
    const {
        status,
        gameState,
        scene,
        error,
        hasSaveData,
        handleNewGame,
        handleLoadGame,
        handleSaveGame,
        handleQuitGame,
        handleCharacterFinalized,
        handleChoice,
        handleFocusOnPoint,
        handleCombineFragments,
        setStatus,
    } = useGameState();

    const handleApiKeySubmit = (key: string) => {
        setApiKey(key); // Save to sessionStorage
        setApiKeyState(key); // Update React state to re-render
    };

    const renderContent = () => {
        if (!apiKey) {
            return <ApiKeyPrompt onApiKeySubmit={handleApiKeySubmit} />;
        }

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
                            onClick={() => {
                                // If the error is due to a bad API key, this allows the user to re-enter it.
                                if (error?.includes("API")) {
                                    setApiKeyState(undefined);
                                }
                                setStatus(GameStatus.MainMenu);
                            }}
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
