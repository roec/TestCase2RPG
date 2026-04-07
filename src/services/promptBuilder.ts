import type { ParsedIntent, StructuredTestCase } from '../types/testCase';

export interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

export const buildParsePrompt = (text: string): ChatMessage[] => [
  {
    role: 'system',
    content:
      'You extract test intent from natural-language QA descriptions for IBM i RPG programs. Return strict JSON only. Do not include markdown code fences.',
  },
  {
    role: 'user',
    content: `Parse this description into JSON with keys: program (string), scenarios (array), notes (array).\nEach scenario must contain: id, description, input, expected, dbSetupHints (string array), cleanupHints (string array).\nIf data is missing, infer minimally and keep placeholders explicit.\nDescription:\n${text}`,
  },
];

export const buildNormalizePrompt = (parsed: ParsedIntent): ChatMessage[] => [
  {
    role: 'system',
    content:
      'You normalize parsed intents into deterministic test case JSON for automation. Return strict JSON only. Do not include markdown code fences.',
  },
  {
    role: 'user',
    content: `Normalize into exactly this schema: {"program":string,"testCases":[{"id":string,"description":string,"input":object,"expected":object,"dbSetup":string[],"cleanup":string[]}]}\nNo markdown, no comments, valid JSON only.\nParsed JSON:\n${JSON.stringify(parsed)}`,
  },
];

export const buildRpgPrompt = (testCaseJson: StructuredTestCase): ChatMessage[] => [
  {
    role: 'system',
    content:
      'You generate executable free-format RPGLE unit test code from structured test-case JSON. Return code only.',
  },
  {
    role: 'user',
    content: `Generate FREE RPG code with these mandatory rules:
1) **FREE and ctl-opt dftactgrp(*no)
2) Main procedure runs all test subroutines
3) One begsr/endsr per test case id
4) Include EXEC SQL setup inserts where dbSetup exists
5) Include CALLP ${testCaseJson.program}
6) Assertions via IF for expected values
7) PASS/FAIL messages via DSPLY
8) Cleanup via EXEC SQL DELETE where cleanup exists
9) Output code only
Structured JSON:\n${JSON.stringify(testCaseJson)}`,
  },
];
