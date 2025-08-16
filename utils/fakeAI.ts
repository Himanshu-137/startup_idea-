import { FakeAIRating } from '../types';

const FUNNY_RATINGS: FakeAIRating[] = [
  { rating: 97, message: "🦄 Unicorn potential detected!" },
  { rating: 94, message: "🚀 Ready for Mars mission!" },
  { rating: 91, message: "💎 Diamond in the rough!" },
  { rating: 89, message: "🔥 This is fire! Literally burning!" },
  { rating: 86, message: "⚡ Lightning strikes twice here!" },
  { rating: 84, message: "🌟 Star quality material!" },
  { rating: 81, message: "🎯 Bulls-eye innovation!" },
  { rating: 78, message: "💡 Edison would be jealous!" },
  { rating: 76, message: "🎪 Circus of possibilities!" },
  { rating: 73, message: "🍯 Sweet spot detected!" },
  { rating: 71, message: "🎲 Worth rolling the dice!" },
  { rating: 68, message: "🌈 Rainbow after the storm!" },
  { rating: 65, message: "🎨 Creative masterpiece!" },
  { rating: 62, message: "🧩 Missing puzzle piece!" },
  { rating: 59, message: "🌱 Seeds of greatness!" },
  { rating: 56, message: "🔧 Needs some fine-tuning!" },
  { rating: 53, message: "⚖️ Balanced but needs push!" },
  { rating: 50, message: "🎭 Drama but with potential!" },
  { rating: 47, message: "🎪 Entertaining concept!" },
  { rating: 44, message: "🌊 Making waves slowly!" },
];

export const generateFakeRating = (): number => {
  const randomRating = FUNNY_RATINGS[Math.floor(Math.random() * FUNNY_RATINGS.length)];
  return randomRating.rating;
};

export const getFakeAIMessage = (rating: number): string => {
  const ratingObj = FUNNY_RATINGS.find(r => r.rating === rating);
  return ratingObj?.message || "🤖 AI is calculating...";
};

export const generateRandomRating = (): FakeAIRating => {
  return FUNNY_RATINGS[Math.floor(Math.random() * FUNNY_RATINGS.length)];
};