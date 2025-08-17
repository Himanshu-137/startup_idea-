# 🚀 Startup Ideas App

A React Native mobile app where users can submit startup ideas, vote for their favorites, and see AI-powered ratings. Built with Expo and featuring smooth animations and dark/light themes.

## 📱 Screenshots

<div align="center">
  <img src="screenshot1.png" width="250" alt="Ideas List" />
  <img src="screenshot2.png" width="250" alt="After Voting" />
  <img src="screenshot3.png" width="250" alt="Leaderboard" />
</div>

*Left: Ideas browsing | Center: After voting | Right: Leaderboard with rankings*

## ✨ Features

- 📝 **Submit Ideas** - Add your startup ideas with name, tagline, and description
- 🤖 **AI Ratings** - Get instant AI-powered ratings (simulated)
- 🗳️ **Voting System** - Vote for ideas you like
- 🏆 **Leaderboard** - See top-ranked ideas with podium display
- 🌙 **Dark/Light Theme** - Toggle between themes
- ✨ **Smooth Animations** - Beautiful transitions and effects
- 💾 **Offline Storage** - All data saved locally
- 📊 **Statistics** - Track total ideas, votes, and ratings

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation system
- **React Native Reanimated** - High-performance animations
- **AsyncStorage** - Local data persistence
- **Context API + useReducer** - State management

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── IdeaCard.tsx            # Individual idea display
│   ├── LeaderboardCard.tsx     # Ranking display cards
│   ├── RatingBadge.tsx         # AI rating display
│   ├── AICalculationModal.tsx  # AI analysis popup
│   └── ToastMessage.tsx        # Notification messages
├── screens/            # Main app screens
│   ├── IdeaSubmission.tsx      # Submit new ideas
│   ├── IdeaListing.tsx         # Browse all ideas
│   └── Leaderboard.tsx         # View rankings
├── navigation/         # App navigation
│   └── TabNavigator.tsx        # Bottom tab navigation
├── context/            # Global state management
│   └── IdeasContext.tsx        # App-wide state
├── utils/              # Helper functions
│   ├── storage.ts              # AsyncStorage wrapper
│   └── fakeAI.ts              # AI rating simulation
├── theme/              # Design system
│   ├── colors.ts               # Color palettes
│   └── fonts.ts               # Typography & spacing
└── types/              # TypeScript definitions
    └── index.ts                # Type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/startup-ideas-app.git
   cd startup-ideas-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   expo start
   # or
   npm start
   ```

4. **Run on device**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📖 How It Works

### 1. App Flow
```
Submit Idea → AI Analysis → Rating Generated → Added to List → Users Vote → Leaderboard Updates
```

### 2. Data Management
- **Ideas**: Stored with ID, name, tagline, description, rating, votes, and timestamp
- **Votes**: Track which ideas each user has voted for
- **Theme**: Remember user's light/dark preference
- **Storage**: Everything saved locally using AsyncStorage

### 3. AI Rating System
Currently uses a simulated AI system that:
- Generates random ratings between 58-95
- Provides themed messages based on rating
- Creates realistic "thinking" animation

## 🎨 UI/UX Features

### Animations
- **Staggered entrance** - Cards animate in sequence
- **Vote feedback** - Button scales and changes color
- **Theme transitions** - Smooth color changes
- **Loading states** - Progress indicators and skeleton screens

### Theme System
- **Light Theme** - Clean, professional look
- **Dark Theme** - Modern, eye-friendly design
- **Dynamic switching** - Instant theme changes
- **Consistent colors** - Semantic color system

### Responsive Design
- **Adaptive layouts** - Works on different screen sizes
- **Touch targets** - Properly sized interactive elements
- **Accessibility** - Screen reader friendly

## 🔧 Configuration

### Customizing AI Ratings
Edit `utils/fakeAI.ts` to modify:
```typescript
const FUNNY_RATINGS: FakeAIRating[] = [
  { rating: 95, message: "🚀 This could be the next unicorn!" },
  { rating: 88, message: "💡 Silicon Valley would be impressed!" },
  // Add your own ratings...
];
```

### Theming
Modify colors in `theme/colors.ts`:
```typescript
export const lightColors: ThemeColors = {
  primary: '#6366f1',    // Main brand color
  secondary: '#ec4899',  // Accent color
  // ... other colors
};
```

## 📊 App Statistics (from screenshots)

- **1 Idea** submitted
- **1 Total Vote** cast
- **Rating 58** average
- **Dark theme** active
- **YGvzb** - sample idea name
- **Ushzn** - sample tagline

## 🔮 Future Enhancements

- [ ] Real AI integration (OpenAI API)
- [ ] User authentication
- [ ] Social features (comments, sharing)
- [ ] Push notifications
- [ ] Categories and tags
- [ ] Search functionality
- [ ] Export/import ideas
- [ ] Web version

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/startup-ideas-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/startup-ideas-app/discussions)

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for excellent libraries
- Icons from Expo Vector Icons
- Inspiration from various startup communities

---

**Made with ❤️ using React Native and Expo**

*Don't forget to ⭐ this repo if you found it helpful!*
