import React, { useState, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { GameState, Genre, Language } from './types';
import type { StoryScene, Choice, PlayerStats, CharacterProfile, RawStoryPart, InventoryItem, OwnedEntity } from './types';
import { startNewGame, advanceStory, generateSceneImage } from './services/geminiService';
import { getInitialPrompt } from './constants';

import { useLocalization } from './contexts/LocalizationContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import LoadingSpinner from './components/LoadingSpinner';

// Helper function to process all state changes from the AI
const updatePlayerState = (currentStats: PlayerStats, storyPart: RawStoryPart): PlayerStats => {
    const newStats = { ...currentStats };

    // Update HP and Gold
    newStats.hp = Math.max(0, currentStats.hp + (storyPart.playerStatsChange?.hp || 0));
    newStats.gold += storyPart.playerStatsChange?.gold || 0;

    // Process inventory changes
    if (storyPart.inventoryChanges) {
        // Remove items
        const removedItemsSet = new Set(storyPart.inventoryChanges.removed || []);
        newStats.inventory = newStats.inventory.filter(item => !removedItemsSet.has(item.name));

        // Add or update items
        (storyPart.inventoryChanges.added || []).forEach(newItem => {
            const existingItemIndex = newStats.inventory.findIndex(item => item.name === newItem.name);
            if (existingItemIndex !== -1) {
                newStats.inventory[existingItemIndex].quantity += newItem.quantity;
            } else {
                newStats.inventory.push(newItem);
            }
        });
    }
    
    // Process entity changes
    if (storyPart.entityChanges) {
        // Remove entities
        const removedEntitiesSet = new Set(storyPart.entityChanges.removed || []);
        newStats.entities = newStats.entities.filter(e => !removedEntitiesSet.has(e.name));

        // Add or update entities
        (storyPart.entityChanges.updated || []).forEach(updatedEntity => {
            const existingEntityIndex = newStats.entities.findIndex(e => e.name === updatedEntity.name);
            if (existingEntityIndex !== -1) {
                newStats.entities[existingEntityIndex] = updatedEntity;
            } else {
                newStats.entities.push(updatedEntity);
            }
        });
    }

    return newStats;
};


const App: React.FC = () => {
    const { language, t } = useLocalization();
    const [gameState, setGameState] = useState<GameState>(GameState.START);
    const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [currentGenre, setCurrentGenre] = useState<Genre | null>(null);
    const [characterProfile, setCharacterProfile] = useState<CharacterProfile | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleNewGame = useCallback(async (genre: Genre, character: CharacterProfile) => {
        try {
            setLoadingMessage(t('loadingFate'));
            setError(null);
            setCurrentGenre(genre);
            setCharacterProfile(character);

            const initialStats: PlayerStats = { hp: 100, maxHp: 100, attack: 10, defense: 5, gold: 0, inventory: [], entities: [] };
            
            const newChat = startNewGame(language, genre, character);
            setChatSession(newChat);
            
            const storyPart = await advanceStory(newChat, getInitialPrompt(language, genre, character));
            
            const finalStats = updatePlayerState(initialStats, storyPart);
            
            if (storyPart.isGameOver || finalStats.hp <= 0) {
                 setCurrentScene({
                    ...storyPart,
                    character,
                    image: '',
                    playerStats: finalStats,
                    isGameOver: true,
                    gameOverReason: finalStats.hp <= 0 ? t('playerDefeated') : storyPart.gameOverReason
                });
                setGameState(GameState.GAME_OVER);
                setLoadingMessage('');
                return;
            }

            setLoadingMessage(t('loadingVision'));
            const imageUrl = await generateSceneImage(storyPart.sceneDescription, genre);

            setCurrentScene({ ...storyPart, character, image: imageUrl, playerStats: finalStats });
            setGameState(GameState.PLAYING);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setGameState(GameState.START);
        } finally {
            setLoadingMessage('');
        }
    }, [language, t]);
    
    const processNextTurn = useCallback(async (input: string) => {
        if (!chatSession || !currentScene || !currentGenre || !characterProfile) {
            setError("The connection to the story was lost. Please start over.");
            setGameState(GameState.START);
            return;
        }

        try {
            setLoadingMessage(t('loadingDestiny'));
            setError(null);
            
            const storyPart = await advanceStory(chatSession, input);
            
            const newStats = updatePlayerState(currentScene.playerStats, storyPart);

            if (storyPart.isGameOver || newStats.hp <= 0) {
                setCurrentScene({ 
                    ...currentScene, 
                    ...storyPart,
                    playerStats: newStats,
                    isGameOver: true, 
                    gameOverReason: newStats.hp <= 0 ? t('playerDefeated') : storyPart.gameOverReason 
                });
                setGameState(GameState.GAME_OVER);
                setLoadingMessage('');
                return;
            }

            setLoadingMessage(t('loadingScene'));
            const imageUrl = await generateSceneImage(storyPart.sceneDescription, currentGenre);

            setCurrentScene({ ...currentScene, ...storyPart, image: imageUrl, playerStats: newStats });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setLoadingMessage('');
        }
    }, [chatSession, currentScene, t, currentGenre, characterProfile]);

    const handleChoice = (choice: Choice) => {
        processNextTurn(choice.text);
    };

    const handleCustomAction = (action: string) => {
        processNextTurn(action);
    };
    
    const handleRestart = () => {
        setChatSession(null);
        setCurrentScene(null);
        setCurrentGenre(null);
        setCharacterProfile(null);
        setError(null);
        setGameState(GameState.START);
    };

    const renderContent = () => {
        switch (gameState) {
            case GameState.PLAYING:
                return currentScene && <GameScreen scene={currentScene} onChoice={handleChoice} onCustomAction={handleCustomAction} isLoading={!!loadingMessage} />;
            case GameState.GAME_OVER:
                return currentScene && <GameOverScreen reason={currentScene.gameOverReason} onRestart={handleRestart} />;
            case GameState.START:
            default:
                return <StartScreen onStart={handleNewGame} />;
        }
    };
    
    return (
        <main className="bg-gray-900 text-gray-200">
            {loadingMessage && <LoadingSpinner message={loadingMessage} />}
            {error && (
                <div className="fixed top-5 right-5 bg-red-800 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm">
                    <p className="font-bold">{t('errorTitle')}</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={() => setError(null)} className="mt-2 text-sm font-bold text-gray-300 hover:text-white">{t('dismiss')}</button>
                </div>
            )}
            {renderContent()}
        </main>
    );
};

export default App;
