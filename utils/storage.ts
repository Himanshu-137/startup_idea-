import AsyncStorage from '@react-native-async-storage/async-storage';
import { Idea, Vote } from '../types';

const KEYS = {
  IDEAS: 'startup_ideas',
  VOTES: 'user_votes',
  THEME: 'app_theme',
} as const;

export const saveIdeas = async (ideas: Idea[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.IDEAS, JSON.stringify(ideas));
  } catch (error) {
    console.error('Error saving ideas:', error);
  }
};

export const loadIdeas = async (): Promise<Idea[]> => {
  try {
    const ideas = await AsyncStorage.getItem(KEYS.IDEAS);
    return ideas ? JSON.parse(ideas) : [];
  } catch (error) {
    console.error('Error loading ideas:', error);
    return [];
  }
};

export const saveVotes = async (votes: Vote): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.VOTES, JSON.stringify(votes));
  } catch (error) {
    console.error('Error saving votes:', error);
  }
};

export const loadVotes = async (): Promise<Vote> => {
  try {
    const votes = await AsyncStorage.getItem(KEYS.VOTES);
    return votes ? JSON.parse(votes) : {};
  } catch (error) {
    console.error('Error loading votes:', error);
    return {};
  }
};

export const saveTheme = async (isDarkMode: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.THEME, JSON.stringify(isDarkMode));
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const loadTheme = async (): Promise<boolean> => {
  try {
    const theme = await AsyncStorage.getItem(KEYS.THEME);
    return theme ? JSON.parse(theme) : false;
  } catch (error) {
    console.error('Error loading theme:', error);
    return false;
  }
};