import React from 'react';
import type { PlayerStats } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface PlayerStatsBarProps {
  stats: PlayerStats;
  characterName: string;
}

const PlayerStatsBar: React.FC<PlayerStatsBarProps> = ({ stats, characterName }) => {
  const { t } = useLocalization();
  const hpPercentage = (stats.hp / stats.maxHp) * 100;

  const getHealthColor = () => {
    if (hpPercentage > 60) return 'bg-green-500';
    if (hpPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-sm p-4 rounded-lg border border-gray-700 w-full">
        <div className="text-center mb-3">
            <h3 className="font-title text-2xl text-white tracking-wider">{characterName}</h3>
        </div>
      <div className="flex justify-between items-center gap-4">
        <div className="flex-grow">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-purple-300">{t('hp')}</span>
            <span className="text-sm font-medium text-gray-300">{stats.hp} / {stats.maxHp}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getHealthColor()}`}
              style={{ width: `${hpPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-center">
            <div>
              <p className="font-bold text-lg text-gray-200">{stats.attack}</p>
              <p className="text-sm text-gray-400">{t('attack')}</p>
            </div>
            <div>
              <p className="font-bold text-lg text-gray-200">{stats.defense}</p>
              <p className="text-sm text-gray-400">{t('defense')}</p>
            </div>
             <div>
              <p className="font-bold text-lg text-yellow-400">{stats.gold}</p>
              <p className="text-sm text-gray-400">{t('gold')}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsBar;
