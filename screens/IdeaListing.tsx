import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { fonts, spacing } from '../theme/fonts';
import { Idea } from '../types';
import IdeaCard from '../components/IdeaCard';

type SortOption = 'rating' | 'votes' | 'recent';

const IdeaListing: React.FC = () => {
  const { isDarkMode, ideas, loading } = useIdeas();
  const colors = isDarkMode ? darkColors : lightColors;
  
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [refreshing, setRefreshing] = useState(false);
  
  const sortButtonScale = useSharedValue(1);

  const getSortedIdeas = (): Idea[] => {
    const sortedIdeas = [...ideas];
    
    switch (sortBy) {
      case 'rating':
        return sortedIdeas.sort((a, b) => b.rating - a.rating);
      case 'votes':
        return sortedIdeas.sort((a, b) => b.voteCount - a.voteCount);
      case 'recent':
        return sortedIdeas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sortedIdeas;
    }
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    sortButtonScale.value = withSpring(1.1, {}, () => {
      sortButtonScale.value = withSpring(1);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const sortButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sortButtonScale.value }],
  }));

  const getSortIcon = (option: SortOption): keyof typeof Ionicons.glyphMap => {
    switch (option) {
      case 'rating': return 'star';
      case 'votes': return 'heart';
      case 'recent': return 'time';
      default: return 'star';
    }
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'rating': return 'Rating';
      case 'votes': return 'Votes';
      case 'recent': return 'Recent';
      default: return 'Rating';
    }
  };

  const renderEmptyState = () => (
    <Animated.View entering={FadeIn} style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="bulb-outline" size={80} color={colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>No Ideas Yet!</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to share your amazing startup idea
      </Text>
    </Animated.View>
  );

  const renderSortButton = (option: SortOption) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.sortButton,
        sortBy === option && styles.sortButtonActive,
      ]}
      onPress={() => handleSort(option)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={getSortIcon(option)}
        size={18}
        color={sortBy === option ? '#ffffff' : colors.textSecondary}
      />
      <Text
        style={[
          styles.sortButtonText,
          sortBy === option && styles.sortButtonTextActive,
        ]}
      >
        {getSortLabel(option)}
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: fonts.sizes.xl,
      fontWeight: fonts.weights.bold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: fonts.sizes.xl,
      fontWeight: fonts.weights.bold,
      color: colors.primary,
    },
    statLabel: {
      fontSize: fonts.sizes.sm,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    sortContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sortButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sortButtonText: {
      fontSize: fonts.sizes.sm,
      fontWeight: fonts.weights.medium,
      color: colors.textSecondary,
      marginLeft: spacing.xs,
    },
    sortButtonTextActive: {
      color: '#ffffff',
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingVertical: spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyIcon: {
      marginBottom: spacing.xl,
    },
    emptyTitle: {
      fontSize: fonts.sizes['2xl'],
      fontWeight: fonts.weights.bold,
      color: colors.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: fonts.sizes.lg,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  const sortedIdeas = getSortedIdeas();
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.voteCount, 0);
  const averageRating = ideas.length > 0 
    ? Math.round(ideas.reduce((sum, idea) => sum + idea.rating, 0) / ideas.length)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Startup Ideas</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ideas.length}</Text>
            <Text style={styles.statLabel}>Ideas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalVotes}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{averageRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        <Animated.View style={[styles.sortContainer, sortButtonAnimatedStyle]}>
          {(['rating', 'votes', 'recent'] as SortOption[]).map(renderSortButton)}
        </Animated.View>
      </View>

      <View style={styles.listContainer}>
        {sortedIdeas.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={sortedIdeas}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <IdeaCard idea={item} index={index} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </View>
    </View>
  );
};

export default IdeaListing;