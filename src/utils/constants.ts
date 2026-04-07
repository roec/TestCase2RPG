import type { StageDefinition } from '../types/stage';

export const EXAMPLE_INPUT = `Test the customer inquiry program CUSTINQ.
If customer ID 123456 exists in CUSTOMER table with balance 1000, the program should return status OK and balance 1000.
If customer ID 999999 does not exist, the program should return NOT_FOUND.
Clean up test data after execution.`;

export const STAGES: StageDefinition[] = [
  {
    key: 'parse',
    label: 'Parse Description',
    description: 'Parse natural language into parsed test intent JSON.',
  },
  {
    key: 'normalize',
    label: 'Generate Structured Test Case',
    description: 'Normalize and validate deterministic test-case JSON.',
  },
  {
    key: 'rpg',
    label: 'Generate RPG Code',
    description: 'Generate executable RPGLE test code from structured JSON.',
  },
  {
    key: 'final',
    label: 'Final Output',
    description: 'Display final code and enable download.',
  },
];
