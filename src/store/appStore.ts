import { create } from 'zustand';
import {
  generateRpgFromTestCase,
  normalizeStructuredTestCase,
  parseDescriptionToTestCase,
} from '../services/deepseek';
import type { ParsedIntent, StructuredTestCase } from '../types/testCase';
import type { StageKey, StageStatus } from '../types/stage';

interface AppState {
  inputText: string;
  currentStage: StageKey;
  stageStatus: Record<StageKey, StageStatus>;
  parsedDescription: ParsedIntent | null;
  structuredTestCaseJson: StructuredTestCase | null;
  generatedRpgCode: string;
  errorMessage: string | null;
  isLoading: boolean;
  setInputText: (inputText: string) => void;
  resetAll: () => void;
  startGeneration: () => Promise<void>;
  parseDescription: () => Promise<ParsedIntent>;
  normalizeTestCase: (parsed: ParsedIntent) => Promise<StructuredTestCase>;
  generateRpgCode: (structured: StructuredTestCase) => Promise<string>;
}

const initialStageStatus: Record<StageKey, StageStatus> = {
  parse: 'idle',
  normalize: 'idle',
  rpg: 'idle',
  final: 'idle',
};

const ensureValidInput = (text: string): void => {
  if (!text.trim()) {
    throw new Error('Please enter a natural-language test case description.');
  }
};

const ensureProgramExists = (program?: string): void => {
  if (!program || !program.trim()) {
    throw new Error('Program name is missing. Please include the target RPG program in your description.');
  }
};

const ensureTestCases = (structured: StructuredTestCase): void => {
  if (!structured.testCases?.length) {
    throw new Error('No test cases were generated. Please provide a more complete description.');
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  inputText: '',
  currentStage: 'parse',
  stageStatus: { ...initialStageStatus },
  parsedDescription: null,
  structuredTestCaseJson: null,
  generatedRpgCode: '',
  errorMessage: null,
  isLoading: false,
  setInputText: (inputText) => set({ inputText }),
  resetAll: () =>
    set({
      inputText: '',
      currentStage: 'parse',
      stageStatus: { ...initialStageStatus },
      parsedDescription: null,
      structuredTestCaseJson: null,
      generatedRpgCode: '',
      errorMessage: null,
      isLoading: false,
    }),
  parseDescription: async () => {
    const { inputText } = get();
    ensureValidInput(inputText);
    const parsed = await parseDescriptionToTestCase(inputText);
    ensureProgramExists(parsed.program);
    return parsed;
  },
  normalizeTestCase: async (parsed) => {
    const structured = await normalizeStructuredTestCase(parsed);
    ensureProgramExists(structured.program);
    ensureTestCases(structured);
    return structured;
  },
  generateRpgCode: async (structured) => {
    const code = await generateRpgFromTestCase(structured);
    if (!code.trim()) {
      throw new Error('Generated RPG code is empty. Please retry.');
    }
    return code;
  },
  startGeneration: async () => {
    set({
      errorMessage: null,
      isLoading: true,
      currentStage: 'parse',
      stageStatus: {
        parse: 'running',
        normalize: 'idle',
        rpg: 'idle',
        final: 'idle',
      },
      parsedDescription: null,
      structuredTestCaseJson: null,
      generatedRpgCode: '',
    });

    try {
      const parsed = await get().parseDescription();
      set((state) => ({
        parsedDescription: parsed,
        currentStage: 'normalize',
        stageStatus: { ...state.stageStatus, parse: 'success', normalize: 'running' },
      }));

      const structured = await get().normalizeTestCase(parsed);
      set((state) => ({
        structuredTestCaseJson: structured,
        currentStage: 'rpg',
        stageStatus: { ...state.stageStatus, normalize: 'success', rpg: 'running' },
      }));

      const code = await get().generateRpgCode(structured);
      set((state) => ({
        generatedRpgCode: code,
        currentStage: 'final',
        isLoading: false,
        stageStatus: {
          ...state.stageStatus,
          rpg: 'success',
          final: 'success',
        },
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected generation error.';
      const current = get().currentStage;
      set((state) => ({
        isLoading: false,
        errorMessage: message,
        stageStatus: {
          ...state.stageStatus,
          [current]: 'error',
        },
      }));
    }
  },
}));
