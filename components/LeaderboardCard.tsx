import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
// import { LinearGradient } from 'expo-linear-gradient';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { fonts, spacing } from '../theme/fonts';
import { Idea } from '../types';
import RatingBadge from './RatingBadge';

interface LeaderboardCardProps {
  idea: Idea;
  position: number;
  index: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ idea, position, index }) => {
  // ALL HOOKS AT TOP LEVEL
  const { isDarkMode } = useIdeas();
  const scale = useSharedValue(0);
  const translateX = useSharedValue(50);
  
  // Derived values (not hooks)
  const colors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    const delay = index * 200;
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
      delay,
    });
    translateX.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
      delay,
    });
  }, [index, scale, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const getRankEmoji = (position: number): string => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}`;
    }
  };

  const getRankColors = (position: number): [string, string] => {
    switch (position) {
      case 1: return ['#FFD700', '#FFA500'];
      case 2: return ['#C0C0C0', '#A8A8A8'];
      case 3: return ['#CD7F32', '#B8860B'];
      default: return [colors.primary, colors.secondary];
    }
  };

  const [gradientStart] = getRankColors(position);
  const totalScore = idea.rating + idea.voteCount * 2; // Custom scoring logic

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    gradient: {
      padding: spacing.md,
      backgroundColor: gradientStart,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    rankSection: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    rankText: {
      fontSize: fonts.sizes.xl,
      fontWeight: fonts.weights.bold,
      color: '#ffffff',
    },
    rankEmoji: {
      fontSize: fonts.sizes['2xl'],
    },
    ideaInfo: {
      flex: 1,
    },
    title: {
      fontSize: fonts.sizes.lg,
      fontWeight: fonts.weights.bold,
      color: '#ffffff',
      marginBottom: spacing.xs,
    },
    tagline: {
      fontSize: fonts.sizes.base,
      color: 'rgba(255, 255, 255, 0.8)',
      fontStyle: 'italic',
    },
    ratingSection: {
      alignItems: 'flex-end',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    scoreText: {
      fontSize: fonts.sizes.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: fonts.weights.medium,
    },
    voteText: {
      fontSize: fonts.sizes.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: fonts.weights.medium,
    },
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.rankSection}>
            {position <= 3 ? (
              <Text style={styles.rankEmoji}>{getRankEmoji(position)}</Text>
            ) : (
              <Text style={styles.rankText}>{position}</Text>
            )}
          </View>
          
          <View style={styles.ideaInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {idea.name}
            </Text>
            <Text style={styles.tagline} numberOfLines={2}>
              {idea.tagline}
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <RatingBadge rating={idea.rating} size="small" />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.scoreText}>
            Score: {totalScore}
          </Text>
          <Text style={styles.voteText}>
            {idea.voteCount} votes
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default LeaderboardCard;