import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AICalculationModalProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
  ideaName: string;
}

const AICalculationModal: React.FC<AICalculationModalProps> = ({
  visible,
  onComplete,
  onCancel,
  ideaName,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onCancel();
        return true; // Prevent default behavior
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [visible, onCancel]);

  // Animation effects
  useEffect(() => {
    if (visible) {
      // Show modal animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000, // 3 seconds for AI calculation simulation
        useNativeDriver: false,
      }).start(() => {
        // Auto complete after animation
        setTimeout(onComplete, 500);
      });
    } else {
      // Reset animations when modal closes
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      progressAnim.setValue(0);
    }
  }, [visible]);

  const handleBackdropPress = () => {
    // Optional: Allow closing by tapping backdrop
    // onCancel();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none" // We handle our own animations
      statusBarTranslucent={true}
      hardwareAccelerated={true}
      presentationStyle="overFullScreen"
    >
      {/* Full Screen Container */}
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
        
        {/* Centered Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -150, // Half of approximate modal height
              marginLeft: -170, // Half of modal width (340/2)
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="analytics" size={32} color="#6366f1" />
                </View>
                <Text style={styles.title}>AI Analysis in Progress</Text>
                <Text style={styles.subtitle}>
                  Analyzing "{ideaName}" for market potential, innovation, and viability
                </Text>
              </View>

              {/* Progress Section */}
              <View style={styles.progressSection}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { width: progressWidth },
                      ]}
                    />
                  </View>
                </View>

                {/* Analysis Steps */}
                <View style={styles.stepsContainer}>
                  <View style={styles.step}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.stepText}>Market Research Complete</Text>
                  </View>
                  <View style={styles.step}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.stepText}>Innovation Score Calculated</Text>
                  </View>
                  <View style={styles.step}>
                    <Ionicons name="analytics" size={20} color="#6366f1" />
                    <Text style={styles.stepText}>Viability Assessment...</Text>
                  </View>
                </View>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: 340,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#f0f0ff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  stepsContainer: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default AICalculationModal;