import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { fonts, spacing } from '../theme/fonts';

interface RatingBadgeProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, size = 'medium' }) => {
  // ALL HOOKS AT TOP LEVEL
  const { isDarkMode } = useIdeas();
  const scale = useSharedValue(0);
  
  // Derived values (not hooks)
  const colors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getRatingColor = (rating: number): string => {
    if (rating >= 90) return colors.success;
    if (rating >= 80) return colors.primary;
    if (rating >= 70) return colors.warning;
    return colors.error;
  };

  const getRatingEmoji = (rating: number): string => {
    if (rating >= 90) return '🔥';
    if (rating >= 80) return '⭐';
    if (rating >= 70) return '👍';
    return '🤔';
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 40,
          borderRadius: 20,
          fontSize: fonts.sizes.sm,
        };
      case 'large':
        return {
          width: 80,
          height: 80,
          borderRadius: 40,
          fontSize: fonts.sizes.xl,
        };
      default:
        return {
          width: 60,
          height: 60,
          borderRadius: 30,
          fontSize: fonts.sizes.base,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const ratingColor = getRatingColor(rating);

  const styles = StyleSheet.create({
    container: {
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: sizeStyles.borderRadius,
      backgroundColor: ratingColor,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    ratingText: {
      color: '#ffffff',
      fontSize: sizeStyles.fontSize,
      fontWeight: fonts.weights.bold,
    },
    emoji: {
      position: 'absolute',
      top: -5,
      right: -5,
      fontSize: size === 'large' ? 20 : size === 'small' ? 12 : 16,
    },
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.ratingText}>{rating}</Text>
      <Text style={styles.emoji}>{getRatingEmoji(rating)}</Text>
    </Animated.View>
  );
};

export default RatingBadge;