import React from 'react';
import Icon from './Icon';
import { ICONS } from '../constants/icons';
import { useLocalization } from '../contexts/LocalizationContext';

interface GameOverScreenProps {
  reason: string;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ reason, onRestart }) => {
  const { t } = useLocalization();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-900 animate-fade-in">
      <div className="max-w-2xl mx-auto bg-gray-800/50 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold text-red-500 font-title">{t('gameOverTitle')}</h1>
        <p className="mt-6 text-xl text-gray-300 italic">
          "{reason}"
        </p>
        <button
          onClick={onRestart}
          className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-gray-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
        >
          <Icon path={ICONS.RESTART} className="w-6 h-6" />
          {t('restart')}
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
