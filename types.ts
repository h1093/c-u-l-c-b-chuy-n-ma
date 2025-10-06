export interface PlayerStats {
  investigation: number;
  supernatural: number;
  social: number;
}

export interface Relationships {
  [characterId: string]: number;
}

export interface StoryFlags {
  [flag: string]: boolean;
}

export interface PlayerTendencies {
  approach: string; // 'action' | 'analysis'
  danger: string; // 'calm' | 'anxious'
  social: string; // 'extrovert' | 'introvert'
  supernatural: string; // 'believer' | 'skeptic'
}

export interface JournalEntry {
  id: string; // sceneId where it was created
  title: string; // A short title for the entry
  content: string; // The text of the journal entry
  isCorrupted?: boolean; // Flag to indicate if the memory is altered
}

export interface MemoryFragment {
  id: string; // a unique ID, e.g., 'MF_PIANO_SONG'
  name: string; // e.g., "Giai điệu piano quen thuộc"
  description: string; // A short, evocative description
}

export interface GameState {
  playerName: string;
  playerGender: string;
  playerMotivation: string;
  playerSkill: string;
  playerFear: string;
  playerTendencies: PlayerTendencies;
  playerDefiningTrait: string;
  playerStats: PlayerStats;
  relationships: Relationships;
  inventory: string[];
  storyFlags: StoryFlags;
  journal: JournalEntry[];
  memoryFragments: MemoryFragment[];
  mentalState: number; // 0-100 scale
  mentalStateDescription: string; // e.g., 'Bình tĩnh', 'Lo lắng', 'Hoảng loạn'
  hubActionsRemaining: number;
  currentSceneId: string;
}

export interface Choice {
  id: string;
  text: string;
}

export interface FocusPoint {
  id: string;
  text: string;
}

export interface Dialogue {
  character: string;
  line: string;
}

export interface Scene {
  id: string;
  description: string;
  dialogue: Dialogue[];
  choices: Choice[];
  focusPoints?: FocusPoint[];
}

export interface GeminiResponse {
  scene: Scene;
  updatedState: GameState;
}

export enum GameStatus {
  MainMenu,
  CharacterCreation,
  Loading,
  Playing,
  Error,
}
