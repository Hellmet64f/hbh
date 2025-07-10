import React, { useState } from 'react';
import type { StoryScene, Choice } from '../types';
import ChoiceButton from './ChoiceButton';
import PlayerStatsBar from './PlayerStatsBar';
import InventoryPanel from './InventoryPanel';
import { useLocalization } from '../contexts/LocalizationContext';

interface GameScreenProps {
  scene: StoryScene;
  onChoice: (choice: Choice) => void;
  onCustomAction: (action: string) => void;
  isLoading: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ scene, onChoice, onCustomAction, isLoading }) => {
  const { t } = useLocalization();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAction, setCustomAction] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAction.trim() && !isLoading) {
      onCustomAction(customAction.trim());
      setCustomAction('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center">
      <div className="w-full h-[40vh] md:h-[55vh] bg-black relative shadow-lg shadow-purple-900/20">
        {scene.image ? (
          <img
            src={scene.image}
            alt="Scene from the adventure"
            className="w-full h-full object-cover animate-fade-in"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <p className="text-gray-500">A vision is forming...</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
      </div>

      <div className="w-full max-w-4xl p-6 md:p-8 flex-1 -mt-16 md:-mt-24 z-10">
        <PlayerStatsBar stats={scene.playerStats} characterName={scene.character.name} />

        <div className="mt-4 bg-gray-800/60 backdrop-blur-md p-6 rounded-xl border border-gray-700 shadow-xl">
          {scene.log && <p className="text-purple-300 text-md md:text-lg leading-relaxed mb-4 font-mono border-b border-purple-800 pb-3"> &gt; {scene.log}</p>}
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic">
            {scene.sceneDescription}
          </p>
        </div>
        
        <InventoryPanel inventory={scene.playerStats.inventory} entities={scene.playerStats.entities} />

        {scene.enemy && (
          <div className="mt-6 bg-red-900/40 border border-red-700 p-4 rounded-lg text-center">
            <h4 className="font-bold text-red-300 text-xl">{scene.enemy.name}</h4>
            <p className="text-red-400">{t('hp')}: {scene.enemy.hp} | {t('attack')}: {scene.enemy.attack}</p>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-title text-purple-400 mb-4 text-center tracking-wider">{t('whatWillYouDo')}</h3>
          {showCustomInput ? (
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 animate-fade-in">
                <textarea
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    placeholder={t('customActionPrompt')}
                    disabled={isLoading}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={2}
                />
                <div className="flex gap-4">
                    <button type="submit" disabled={isLoading || !customAction.trim()} className="flex-1 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {t('submitAction')}
                    </button>
                    <button type="button" onClick={() => setShowCustomInput(false)} disabled={isLoading} className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50">
                        {t('cancel')}
                    </button>
                </div>
            </form>
          ) : (
            <div className='animate-fade-in'>
              <div className="space-y-4">
                {scene.choices.map((choice, index) => (
                  <ChoiceButton
                    key={index}
                    text={choice.text}
                    onClick={() => onChoice(choice)}
                    disabled={isLoading}
                  />
                ))}
              </div>
              <div className="text-center mt-6">
                <button 
                  onClick={() => setShowCustomInput(true)} 
                  disabled={isLoading}
                  className="px-6 py-2 bg-transparent border border-gray-600 text-gray-400 font-bold rounded-lg hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
                >
                    {t('otherAction')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
