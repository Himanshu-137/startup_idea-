import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { spacing } from '../theme/fonts';

import IdeaSubmission from '../screens/IdeaSubmission';
import IdeaListing from '../screens/IdeaListing';
import Leaderboard from '../screens/Leaderboard';

type TabParamList = {
  Submit: undefined;
  Ideas: undefined;
  Leaderboard: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

interface AnimatedTabIconProps {
  focused: boolean;
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ focused, name, color, size }) => {
  // ALL HOOKS AT TOP LEVEL
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.2, { damping: 15, stiffness: 200 });
      rotation.value = withSpring(360, { damping: 15, stiffness: 100 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      rotation.value = withSpring(0, { damping: 15, stiffness: 100 });
    }
  }, [focused, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  // ALL HOOKS AT TOP LEVEL
  const translateX = useSharedValue(isDarkMode ? 22 : 0);
  const backgroundColor = useSharedValue(isDarkMode ? darkColors.primary : lightColors.border);

  // Derived values
  const colors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    translateX.value = withSpring(isDarkMode ? 22 : 0, {
      damping: 15,
      stiffness: 200,
    });
    backgroundColor.value = isDarkMode ? darkColors.primary : lightColors.border;
  }, [isDarkMode, translateX]);

  const animatedToggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  const styles = StyleSheet.create({
    toggleContainer: {
      position: 'absolute',
      top: 60,
      right: 20,
      zIndex: 1000,
    },
    toggle: {
      width: 50,
      height: 28,
      borderRadius: 14,
      padding: 2,
      justifyContent: 'center',
    },
    toggleButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <Animated.View style={[styles.toggle, animatedBackgroundStyle]}>
          <Animated.View style={[styles.toggleButton, animatedToggleStyle]}>
            <Ionicons
              name={isDarkMode ? "moon" : "sunny"}
              size={14}
              color={isDarkMode ? darkColors.primary : lightColors.warning}
            />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator: React.FC = () => {
  // ALL HOOKS AT TOP LEVEL
  const { isDarkMode, toggleTheme } = useIdeas();
  
  // Derived values
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <>
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Submit':
                iconName = focused ? 'add-circle' : 'add-circle-outline';
                break;
              case 'Ideas':
                iconName = focused ? 'bulb' : 'bulb-outline';
                break;
              case 'Leaderboard':
                iconName = focused ? 'trophy' : 'trophy-outline';
                break;
              default:
                iconName = 'help-circle-outline';
            }

            return (
              <AnimatedTabIcon
                focused={focused}
                name={iconName}
                color={color}
                size={size}
              />
            );
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 90,
            paddingBottom: spacing.md,
            paddingTop: spacing.sm,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '700',
          },
          headerTintColor: colors.text,
        })}
      >
        <Tab.Screen
          name="Submit"
          component={IdeaSubmission}
          options={{
            title: 'Submit Idea',
            tabBarLabel: 'Submit',
          }}
        />
        <Tab.Screen
          name="Ideas"
          component={IdeaListing}
          options={{
            title: 'All Ideas',
            tabBarLabel: 'Ideas',
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={Leaderboard}
          options={{
            title: 'Top Ideas',
            tabBarLabel: 'Leaderboard',
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;