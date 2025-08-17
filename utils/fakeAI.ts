import { FakeAIRating } from '../types';

const FUNNY_RATINGS: FakeAIRating[] = [
  { rating: 95, message: "🚀 This could be the next unicorn!" },
  { rating: 88, message: "💡 Silicon Valley would be impressed!" },
  { rating: 92, message: "🔥 Hot startup alert!" },
  { rating: 76, message: "📈 Solid potential here!" },
  { rating: 83, message: "⭐ Pretty innovative idea!" },
  { rating: 69, message: "🤔 Interesting concept..." },
  { rating: 71, message: "💰 Could make some money!" },
  { rating: 58, message: "🎯 Needs some fine-tuning!" },
  { rating: 84, message: "🌟 Above average creativity!" },
  { rating: 67, message: "💭 Room for improvement!" },
  { rating: 91, message: "🎉 Impressive innovation!" },
  { rating: 73, message: "🔍 Worth exploring further!" },
  { rating: 82, message: "💎 Hidden gem potential!" },
  { rating: 65, message: "🌱 Early stage but promising!" },
  { rating: 89, message: "🏆 Competition-worthy idea!" },
];

export const generateFakeRating = (): number => {
  const randomRating = FUNNY_RATINGS[Math.floor(Math.random() * FUNNY_RATINGS.length)];
  return randomRating.rating;
};

export const getFakeAIMessage = (rating: number): string => {
  const ratingObj = FUNNY_RATINGS.find(r => r.rating === rating);
  return ratingObj?.message || "🤖 AI is thinking...";
};

export const generateRandomRating = (): FakeAIRating => {
  return FUNNY_RATINGS[Math.floor(Math.random() * FUNNY_RATINGS.length)];
};