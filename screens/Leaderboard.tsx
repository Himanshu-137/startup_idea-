import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { fonts, spacing } from '../theme/fonts';
import { Idea } from '../types';
import LeaderboardCard from '../components/LeaderboardCard';

const Leaderboard: React.FC = () => {
  // ALL HOOKS AT TOP LEVEL - NO EXCEPTIONS
  const { isDarkMode, ideas } = useIdeas();
  const [refreshing, setRefreshing] = useState(false);
  const headerScale = useSharedValue(1);
  
  // Derived values (not hooks) - these are safe to compute
  const colors = isDarkMode ? darkColors : lightColors;

  // Calculate top ideas - this is NOT a hook, just a regular function
  const getTopIdeas = (): Idea[] => {
    if (!ideas || ideas.length === 0) return [];
    
    const scoredIdeas = ideas.map(idea => ({
      ...idea,
      totalScore: idea.rating + (idea.voteCount * 2), // Give votes more weight
    }));
    
    return scoredIdeas
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10); // Top 10 ideas
  };

  const onRefresh = () => {
    setRefreshing(true);
    headerScale.value = withSpring(1.05, {}, () => {
      headerScale.value = withSpring(1);
    });
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  // Get computed values
  const topIdeas = getTopIdeas();
  const totalIdeas = ideas?.length || 0;
  const totalVotes = ideas?.reduce((sum, idea) => sum + idea.voteCount, 0) || 0;
  const highestRated = ideas?.length > 0 ? Math.max(...ideas.map(idea => idea.rating)) : 0;

  const renderEmptyState = () => (
    <Animated.View entering={FadeIn.delay(300)} style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="trophy-outline" size={80} color={colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>No Competition Yet!</Text>
      <Text style={styles.emptySubtitle}>
        Submit ideas and vote to see the leaderboard
      </Text>
    </Animated.View>
  );

  const renderPodium = () => {
    const topThree = topIdeas.slice(0, 3);
    if (topThree.length === 0) return null;

    return (
      <Animated.View entering={SlideInDown.delay(200)} style={styles.podiumContainer}>
        <View style={styles.podiumGradient}>
          <View style={styles.podiumContent}>
            <Text style={styles.podiumTitle}>🏆 Top 3 Champions</Text>
            <View style={styles.podiumRow}>
              {topThree.map((idea, index) => (
                <View key={idea.id} style={[styles.podiumItem, { 
                  height: index === 0 ? 120 : index === 1 ? 100 : 80 
                }]}>
                  <View style={styles.podiumRank}>
                    <Text style={styles.podiumRankText}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={2}>
                    {idea.name}
                  </Text>
                  <Text style={styles.podiumScore}>
                    {idea.rating + (idea.voteCount * 2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderStats = () => (
    <Animated.View entering={FadeIn.delay(400)} style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="bulb" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{totalIdeas}</Text>
          <Text style={styles.statLabel}>Total Ideas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="heart" size={24} color={colors.error} />
          <Text style={styles.statNumber}>{totalVotes}</Text>
          <Text style={styles.statLabel}>Total Votes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={24} color={colors.warning} />
          <Text style={styles.statNumber}>{highestRated}</Text>
          <Text style={styles.statLabel}>Top Rating</Text>
        </View>
      </View>
    </Animated.View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: fonts.sizes['3xl'],
      fontWeight: fonts.weights.bold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    headerSubtitle: {
      fontSize: fonts.sizes.lg,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    podiumContainer: {
      marginHorizontal: spacing.md,
      marginVertical: spacing.lg,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    podiumGradient: {
      padding: spacing.lg,
      backgroundColor: colors.primary,
    },
    podiumContent: {
      alignItems: 'center',
    },
    podiumTitle: {
      fontSize: fonts.sizes.xl,
      fontWeight: fonts.weights.bold,
      color: '#ffffff',
      marginBottom: spacing.lg,
    },
    podiumRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
    },
    podiumItem: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
      padding: spacing.sm,
      minWidth: 80,
      justifyContent: 'flex-end',
    },
    podiumRank: {
      marginBottom: spacing.sm,
    },
    podiumRankText: {
      fontSize: fonts.sizes['2xl'],
    },
    podiumName: {
      fontSize: fonts.sizes.sm,
      fontWeight: fonts.weights.semibold,
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    podiumScore: {
      fontSize: fonts.sizes.base,
      fontWeight: fonts.weights.bold,
      color: '#ffffff',
    },
    statsContainer: {
      marginHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statNumber: {
      fontSize: fonts.sizes.xl,
      fontWeight: fonts.weights.bold,
      color: colors.text,
      marginVertical: spacing.xs,
    },
    statLabel: {
      fontSize: fonts.sizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingBottom: spacing.xl,
    },
    sectionHeader: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: fonts.sizes.lg,
      fontWeight: fonts.weights.semibold,
      color: colors.text,
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>🏆 Leaderboard</Text>
        <Text style={styles.headerSubtitle}>
          Top startup ideas ranked by rating and votes
        </Text>
      </Animated.View>

      {topIdeas.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={[]}
          keyExtractor={() => 'header'}
          ListHeaderComponent={
            <>
              {renderPodium()}
              {renderStats()}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Full Rankings</Text>
              </View>
            </>
          }
          renderItem={null}
          ListFooterComponent={
            <View>
              {topIdeas.map((idea, index) => (
                <LeaderboardCard
                  key={idea.id}
                  idea={idea}
                  position={index + 1}
                  index={index}
                />
              ))}
            </View>
          }
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
  );
};

export default Leaderboard;