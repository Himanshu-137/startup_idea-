import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { fonts, spacing } from '../theme/fonts';
import { Idea } from '../types';
import RatingBadge from './RatingBadge';

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index }) => {
  const { isDarkMode, voteForIdea, votes } = useIdeas();
  const colors = isDarkMode ? darkColors : lightColors;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const hasVoted = votes[idea.id] || false;
  
  const expandedHeight = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const voteScale = useSharedValue(1);

  React.useEffect(() => {
    // Staggered entrance animation
    cardScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
      delay: index * 100,
    });
  }, [index]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    expandedHeight.value = withSpring(isExpanded ? 0 : 1, {
      damping: 15,
      stiffness: 100,
    });
  };

  const handleVote = () => {
    if (!hasVoted) {
      voteScale.value = withSpring(1.2, { damping: 10 }, () => {
        voteScale.value = withSpring(1);
      });
      voteForIdea(idea.id);
    }
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const expandedAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(expandedHeight.value, [0, 1], [0, 80]);
    return {
      height,
      opacity: expandedHeight.value,
    };
  });

  const voteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: voteScale.value }],
  }));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: 16,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    leftSection: {
      flex: 1,
      marginRight: spacing.sm,
    },
    title: {
      fontSize: fonts.sizes.lg,
      fontWeight: fonts.weights.bold,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    tagline: {
      fontSize: fonts.sizes.base,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    voteSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    voteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: hasVoted ? colors.success : colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    voteText: {
      color: '#ffffff',
      fontSize: fonts.sizes.sm,
      fontWeight: fonts.weights.medium,
      marginLeft: spacing.xs,
    },
    voteCount: {
      fontSize: fonts.sizes.sm,
      color: colors.textSecondary,
      fontWeight: fonts.weights.medium,
    },
    expandButton: {
      padding: spacing.xs,
    },
    expandedContent: {
      overflow: 'hidden',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    description: {
      fontSize: fonts.sizes.base,
      color: colors.text,
      lineHeight: 22,
    },
  });

  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{idea.name}</Text>
          <Text style={styles.tagline}>{idea.tagline}</Text>
        </View>
        <RatingBadge rating={idea.rating} size="medium" />
      </View>

      <View style={styles.footer}>
        <View style={styles.voteSection}>
          <Animated.View style={voteAnimatedStyle}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={handleVote}
              disabled={hasVoted}
              activeOpacity={0.8}
            >
              <Ionicons
                name={hasVoted ? "heart" : "heart-outline"}
                size={16}
                color="#ffffff"
              />
              <Text style={styles.voteText}>
                {hasVoted ? "Voted" : "Vote"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.voteCount}>{idea.voteCount} votes</Text>
        </View>

        <TouchableOpacity
          style={styles.expandButton}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.expandedContent, expandedAnimatedStyle]}>
        <Text style={styles.description}>{idea.description}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default IdeaCard;