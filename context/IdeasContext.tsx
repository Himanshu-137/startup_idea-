import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { loadIdeas, saveIdeas, loadTheme, saveTheme, loadVotes, saveVotes } from '../utils/storage';
import { generateFakeRating } from '../utils/fakeAI';
import { Idea, Vote, IdeasContextType } from '../types';

interface IdeasState {
  ideas: Idea[];
  votes: Vote;
  isDarkMode: boolean;
  loading: boolean;
}

type IdeasAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_IDEAS'; payload: Idea[] }
  | { type: 'ADD_IDEA'; payload: Omit<Idea, 'id' | 'rating' | 'voteCount' | 'createdAt'> }
  | { type: 'SET_VOTES'; payload: Vote }
  | { type: 'VOTE_IDEA'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: boolean };

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

const initialState: IdeasState = {
  ideas: [],
  votes: {},
  isDarkMode: false,
  loading: true,
};

function ideasReducer(state: IdeasState, action: IdeasAction): IdeasState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_IDEAS':
      return { ...state, ideas: action.payload };
    case 'ADD_IDEA':
      const newIdea: Idea = {
        id: Date.now().toString(),
        ...action.payload,
        rating: generateFakeRating(),
        voteCount: 0,
        createdAt: new Date().toISOString(),
      };
      return { ...state, ideas: [...state.ideas, newIdea] };
    case 'SET_VOTES':
      return { ...state, votes: action.payload };
    case 'VOTE_IDEA':
      if (state.votes[action.payload]) return state; // Already voted
      const updatedIdeas = state.ideas.map(idea =>
        idea.id === action.payload
          ? { ...idea, voteCount: idea.voteCount + 1 }
          : idea
      );
      const updatedVotes = { ...state.votes, [action.payload]: true };
      return { ...state, ideas: updatedIdeas, votes: updatedVotes };
    case 'TOGGLE_THEME':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_THEME':
      return { ...state, isDarkMode: action.payload };
    default:
      return state;
  }
}

interface IdeasProviderProps {
  children: ReactNode;
}

export function IdeasProvider({ children }: IdeasProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(ideasReducer, initialState);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      saveIdeas(state.ideas);
      saveVotes(state.votes);
      saveTheme(state.isDarkMode);
    }
  }, [state.ideas, state.votes, state.isDarkMode, state.loading]);

  const loadData = async (): Promise<void> => {
    try {
      const [ideas, votes, theme] = await Promise.all([
        loadIdeas(),
        loadVotes(),
        loadTheme()
      ]);
      dispatch({ type: 'SET_IDEAS', payload: ideas });
      dispatch({ type: 'SET_VOTES', payload: votes });
      dispatch({ type: 'SET_THEME', payload: theme });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addIdea = (idea: Omit<Idea, 'id' | 'rating' | 'voteCount' | 'createdAt'>): void => {
    dispatch({ type: 'ADD_IDEA', payload: idea });
  };

  const voteForIdea = (ideaId: string): void => {
    dispatch({ type: 'VOTE_IDEA', payload: ideaId });
  };

  const toggleTheme = (): void => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const contextValue: IdeasContextType = {
    ...state,
    addIdea,
    voteForIdea,
    toggleTheme,
  };

  return (
    <IdeasContext.Provider value={contextValue}>
      {children}
    </IdeasContext.Provider>
  );
}

export const useIdeas = (): IdeasContextType => {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
};