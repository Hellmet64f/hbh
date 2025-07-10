import React, { useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Genre, CharacterProfile } from '../types';

interface StartScreenProps {
  onStart: (genre: Genre, character: CharacterProfile) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const { t } = useLocalization();
  const [selectedGenre, setSelectedGenre] = useState<Genre>(Genre.FANTASY);
  const [character, setCharacter] = useState<CharacterProfile>({
    name: '',
    power: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCharacter(prev => ({ ...prev, [name]: value }));
  };

  const isStartDisabled = !character.name.trim() || !character.power.trim() || !character.description.trim();

  const genres = [
    { id: Genre.FANTASY, name: t('genre_FANTASY') },
    { id: Genre.ISEKAI, name: t('genre_ISEKAI') },
    { id: Genre.SCI_FI, name: t('genre_SCI_FI') },
    { id: Genre.CYBERPUNK, name: t('genre_CYBERPUNK') },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 animate-fade-in">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-100 font-title tracking-widest">
          {t('title')}
        </h1>
        <h2 className="text-xl md:text-2xl text-purple-400 mt-2 font-title">
          {t('subtitle')}
        </h2>
        
        <div className="mt-8 text-left grid md:grid-cols-2 gap-8 items-start">
            {/* Left side: Character Creation */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-2xl font-title text-gray-200 mb-4 tracking-wider text-center">{t('characterCreationTitle')}</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-purple-300">{t('characterName')}</label>
                        <input type="text" name="name" id="name" value={character.name} onChange={handleInputChange} placeholder={t('namePlaceholder')} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                     <div>
                        <label htmlFor="power" className="block text-sm font-medium text-purple-300">{t('characterPower')}</label>
                        <input type="text" name="power" id="power" value={character.power} onChange={handleInputChange} placeholder={t('powerPlaceholder')} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-purple-300">{t('characterDescription')}</label>
                        <textarea name="description" id="description" value={character.description} onChange={handleInputChange} rows={4} placeholder={t('descriptionPlaceholder')} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 resize-none"></textarea>
                    </div>
                </div>
            </div>

            {/* Right side: Genre Selection */}
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-2xl font-title text-gray-200 mb-4 tracking-wider text-center">{t('chooseYourGenre')}</h3>
                <div className="grid grid-cols-2 gap-4">
                    {genres.map(genre => (
                    <button
                        key={genre.id}
                        onClick={() => setSelectedGenre(genre.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedGenre === genre.id
                            ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                        }`}
                    >
                        <span className="font-bold text-lg">{genre.name}</span>
                    </button>
                    ))}
                </div>
            </div>
        </div>


        <button
          onClick={() => onStart(selectedGenre, character)}
          disabled={isStartDisabled}
          className="mt-10 px-12 py-4 bg-purple-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          {t('beginAdventure')}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
