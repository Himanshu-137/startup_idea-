export interface Idea {
  id: string;
  name: string;
  tagline: string;
  description: string;
  rating: number;
  voteCount: number;
  createdAt: string;
}

export interface Vote {
  [ideaId: string]: boolean;
}

export interface FakeAIRating {
  rating: number;
  message: string;
}

export interface IdeasContextType {
  ideas: Idea[];
  votes: Vote;
  isDarkMode: boolean;
  loading: boolean;
  addIdea: (idea: Omit<Idea, 'id' | 'rating' | 'voteCount' | 'createdAt'>) => void;
  voteForIdea: (ideaId: string) => void;
  toggleTheme: () => void;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  gold: string;
  silver: string;
  bronze: string;
}