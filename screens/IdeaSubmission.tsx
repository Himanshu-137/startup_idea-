import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useIdeas } from '../context/IdeasContext';
import { lightColors, darkColors } from '../theme/colors';
import { fonts, spacing } from '../theme/fonts';
import ToastMessage from '../components/ToastMessage';

const IdeaSubmission: React.FC = () => {
  const { isDarkMode, addIdea } = useIdeas();
  const navigation = useNavigation();
  const colors = isDarkMode ? darkColors : lightColors;
  
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const submitButtonScale = useSharedValue(1);
  const formOpacity = useSharedValue(1);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a startup name');
      return;
    }
    if (!tagline.trim()) {
      Alert.alert('Error', 'Please enter a tagline');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    setIsSubmitting(true);

    // Button animation
    submitButtonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );

    // Form fade animation
    formOpacity.value = withSpring(0.7);

    // Simulate API call delay
    setTimeout(() => {
      addIdea({
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
      });

      // Reset form
      setName('');
      setTagline('');
      setDescription('');
      
      // Show success toast
      setToastMessage('🎉 Idea submitted successfully!');
      setShowToast(true);
      
      setIsSubmitting(false);
      formOpacity.value = withSpring(1);

      // Navigate to ideas list after a delay
      setTimeout(() => {
        navigation.navigate('Ideas' as never);
      }, 2000);
    }, 1500);
  };

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      padding: spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    headerIcon: {
      width: 80,
      height: 80,
      backgroundColor: colors.primary,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    headerTitle: {
      fontSize: fonts.sizes['3xl'],
      fontWeight: fonts.weights.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    headerSubtitle: {
      fontSize: fonts.sizes.lg,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      marginBottom: spacing.xl,
    },
    inputGroup: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: fonts.sizes.base,
      fontWeight: fonts.weights.semibold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: spacing.md,
      fontSize: fonts.sizes.base,
      color: colors.text,
      minHeight: 50,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    characterCount: {
      fontSize: fonts.sizes.sm,
      color: colors.textSecondary,
      textAlign: 'right',
      marginTop: spacing.xs,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    submitButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: fonts.sizes.lg,
      fontWeight: fonts.weights.bold,
      color: '#ffffff',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: fonts.sizes.lg,
      fontWeight: fonts.weights.bold,
      color: '#ffffff',
      marginLeft: spacing.sm,
    },
    tips: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginTop: spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    tipsTitle: {
      fontSize: fonts.sizes.lg,
      fontWeight: fonts.weights.semibold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    tipText: {
      fontSize: fonts.sizes.base,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.xs,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="rocket" size={40} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>Share Your Idea</Text>
            <Text style={styles.headerSubtitle}>
              Submit your startup idea and get an instant AI rating!
            </Text>
          </View>

          <Animated.View style={[styles.form, formAnimatedStyle]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Startup Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., TechFlow, InnovateCo"
                placeholderTextColor={colors.textSecondary}
                maxLength={50}
                editable={!isSubmitting}
              />
              <Text style={styles.characterCount}>{name.length}/50</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tagline *</Text>
              <TextInput
                style={styles.input}
                value={tagline}
                onChangeText={setTagline}
                placeholder="One-line description of your idea"
                placeholderTextColor={colors.textSecondary}
                maxLength={100}
                editable={!isSubmitting}
              />
              <Text style={styles.characterCount}>{tagline.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your startup idea, target market, and unique value proposition..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
                editable={!isSubmitting}
              />
              <Text style={styles.characterCount}>{description.length}/500</Text>
            </View>

            <Animated.View style={submitButtonAnimatedStyle}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <Ionicons name="analytics" size={24} color="#ffffff" />
                    <Text style={styles.loadingText}>AI Analyzing...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Submit Idea 🚀</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 Tips for a Great Submission</Text>
            <Text style={styles.tipText}>• Be specific about your target audience</Text>
            <Text style={styles.tipText}>• Explain what makes your idea unique</Text>
            <Text style={styles.tipText}>• Mention the problem you're solving</Text>
            <Text style={styles.tipText}>• Keep it clear and concise</Text>
          </View>
        </View>
      </ScrollView>

      <ToastMessage
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
        type="success"
      />
    </KeyboardAvoidingView>
  );
};

export default IdeaSubmission;