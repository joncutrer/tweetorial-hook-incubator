
export enum Step {
  TOPIC_INPUT = 0,
  EVERYDAY_EXAMPLES = 1,
  COMMON_EXPERIENCES = 2,
  PERSONAL_ANECDOTE = 3,
  SPECIFIC_ANECDOTE = 4,
  SAMPLE_HOOK = 5,
  FINAL_EDIT = 6
}

export interface AppState {
  topic: string;
  everydayExample: string;
  commonExperience: string;
  personalAnecdote: string;
  specificAnecdote: string;
  generatedHook: string;
  finalHook: string;
}

export interface AISuggestion {
  id: string;
  text: string;
}
