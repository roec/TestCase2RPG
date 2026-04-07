export interface ParsedScenario {
  id: string;
  description: string;
  input: Record<string, unknown>;
  expected: Record<string, unknown>;
  dbSetupHints: string[];
  cleanupHints: string[];
}

export interface ParsedIntent {
  program: string;
  scenarios: ParsedScenario[];
  notes?: string[];
}

export interface NormalizedTestCase {
  id: string;
  description: string;
  input: Record<string, unknown>;
  expected: Record<string, unknown>;
  dbSetup: string[];
  cleanup: string[];
}

export interface StructuredTestCase {
  program: string;
  testCases: NormalizedTestCase[];
}
