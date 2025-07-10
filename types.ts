export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
}

export enum Language {
  EN = 'en',
  PT = 'pt',
}

export enum Genre {
  FANTASY = 'FANTASY',
  ISEKAI = 'ISEKAI',
  SCI_FI = 'SCI_FI',
  CYBERPUNK = 'CYBERPUNK',
}

export interface CharacterProfile {
    name: string;
    power: string;
    description: string;
}

export interface InventoryItem {
    name: string;
    quantity: number;
    description: string;
}

export interface OwnedEntity {
    name: string;
    type: string; // e.g., "Guild", "Company", "Syndicate"
    roles: { role: string; person: string }[]; // e.g., [{role: "Owner", person: "Player"}, {role: "CEO", person: "NPC Name"}]
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  gold: number;
  inventory: InventoryItem[];
  entities: OwnedEntity[];
}

export interface Enemy {
  name: string;
  hp: number;
  attack: number;
}

export interface Choice {
  text: string;
}

// Data structure expected from the Gemini API
export interface RawStoryPart {
    sceneDescription: string;
    choices: Choice[];
    isGameOver: boolean;
    gameOverReason: string;
    log: string; 
    playerStatsChange: {
        hp: number;
        gold: number;
    };
    inventoryChanges: {
        added: InventoryItem[]; // Items to add or update quantity
        removed: string[]; // Names of items to remove
    };
    entityChanges: {
        updated: OwnedEntity[]; // Entities to add or update
        removed: string[]; // Names of entities to remove
    };
    enemy: Enemy | null;
}

// Full scene data used by the UI components
export interface StoryScene {
  character: CharacterProfile;
  image: string;
  sceneDescription: string;
  choices: Choice[];
  isGameOver: boolean;
  gameOverReason: string;
  log: string;
  playerStats: PlayerStats;
  enemy: Enemy | null;
}
