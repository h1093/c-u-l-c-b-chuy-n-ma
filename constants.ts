import { GameState } from './types';

export const INITIAL_GAME_STATE: GameState = {
  playerName: '',
  playerGender: '',
  playerMotivation: '',
  playerSkill: '',
  playerFear: '',
  playerTendencies: {
    approach: '',
    danger: '',
    social: '',
    supernatural: '',
  },
  playerDefiningTrait: '',
  playerStats: {
    investigation: 1,
    supernatural: 1,
    social: 1,
  },
  relationships: {
    ohJihye: 0,
    kimHyunwoo: 0,
    leeSoyeon: 0,
  },
  inventory: [],
  storyFlags: {},
  journal: [],
  memoryFragments: [],
  mentalState: 100,
  mentalStateDescription: 'Bình tĩnh',
  hubActionsRemaining: 0,
  currentSceneId: 'START',
};

export const SAVE_GAME_KEY = 'ghostStoryClubRpgSave';
