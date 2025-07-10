import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Language } from '../types';

const translations = {
  en: {
    title: "Gemini Adventure",
    subtitle: "The Shadowed Path",
    description: "Your fate is unwritten. In a world woven by Gemini's imagination, every choice carves a new reality. A unique story and a new vision await your command.",
    beginAdventure: "Begin Adventure",
    gameOverTitle: "The Tale Concludes",
    restart: "Venture Forth Anew",
    whatWillYouDo: "What will you do?",
    loadingFate: "The Chronicler is weaving your fate...",
    loadingVision: "A vision forms in the ether...",
    loadingDestiny: "Your choice echoes through destiny...",
    loadingScene: "A new scene materializes...",
    errorTitle: "An Error Occurred",
    dismiss: "Dismiss",
    playerDefeated: "You have been defeated.",
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    gold: "Gold",
    otherAction: "Do something else...",
    submitAction: "Submit",
    cancel: "Cancel",
    customActionPrompt: "What do you want to do?",
    chooseYourGenre: "Choose Your Genre",
    genre_FANTASY: "Dark Fantasy",
    genre_ISEKAI: "Isekai",
    genre_SCI_FI: "Sci-Fi",
    genre_CYBERPUNK: "Cyberpunk",
    characterCreationTitle: "Create Your Hero",
    characterName: "Name",
    characterPower: "Unique Power / Skill",
    characterDescription: "Appearance / Backstory",
    namePlaceholder: "e.g., Kaelen the Silent",
    powerPlaceholder: "e.g., Can speak with shadows",
    descriptionPlaceholder: "e.g., A tall rogue with a scarred face and piercing silver eyes...",
    inventoryTab: "Inventory",
    organizationsTab: "Organizations",
    itemHeader: "Item",
    quantityHeader: "Qty",
    nameHeader: "Name",
    typeHeader: "Type",
    rolesHeader: "Roles",
  },
  pt: {
    title: "Aventura Gemini",
    subtitle: "O Caminho Sombrio",
    description: "Seu destino não está escrito. Em um mundo tecido pela imaginação do Gemini, cada escolha esculpe uma nova realidade. Uma história única e uma nova visão aguardam seu comando.",
    beginAdventure: "Começar Aventura",
    gameOverTitle: "O Conto Termina",
    restart: "Aventurar-se Novamente",
    whatWillYouDo: "O que você fará?",
    loadingFate: "O Cronista está tecendo seu destino...",
    loadingVision: "Uma visão se forma no éter...",
    loadingDestiny: "Sua escolha ecoa pelo destino...",
    loadingScene: "Uma nova cena se materializa...",
    errorTitle: "Ocorreu um Erro",
    dismiss: "Dispensar",
    playerDefeated: "Você foi derrotado.",
    hp: "PV",
    attack: "ATQ",
    defense: "DEF",
    gold: "Ouro",
    otherAction: "Fazer outra coisa...",
    submitAction: "Enviar",
    cancel: "Cancelar",
    customActionPrompt: "O que você quer fazer?",
    chooseYourGenre: "Escolha o Gênero",
    genre_FANTASY: "Fantasia Sombria",
    genre_ISEKAI: "Isekai",
    genre_SCI_FI: "Ficção Científica",
    genre_CYBERPUNK: "Cyberpunk",
    characterCreationTitle: "Crie Seu Herói",
    characterName: "Nome",
    characterPower: "Poder / Habilidade Única",
    characterDescription: "Aparência / História",
    namePlaceholder: "Ex: Kaelen, o Silencioso",
    powerPlaceholder: "Ex: Consegue falar com as sombras",
    descriptionPlaceholder: "Ex: Um ladrão alto com um rosto marcado por cicatrizes e olhos prateados penetrantes...",
    inventoryTab: "Inventário",
    organizationsTab: "Organizações",
    itemHeader: "Item",
    quantityHeader: "Qtd",
    nameHeader: "Nome",
    typeHeader: "Tipo",
    rolesHeader: "Cargos",
  }
};

type TranslationKey = keyof typeof translations.en;

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.PT);

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations.en[key];
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
