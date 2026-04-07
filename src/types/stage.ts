export type StageKey = 'parse' | 'normalize' | 'rpg' | 'final';

export type StageStatus = 'idle' | 'running' | 'success' | 'error';

export interface StageDefinition {
  key: StageKey;
  label: string;
  description: string;
}
