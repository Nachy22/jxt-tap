import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../theme/colors';

const SplashScreen = ({ navigation }: any) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [progress, navigation]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Image
          source={require('../assets/logo-icon.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.wordmarkRow}>
        <Text style={styles.wordmarkJxt}>Jxt</Text>
        <Text style={styles.wordmarkTap}> Tap</Text>
      </View>

      <Text style={styles.subtitle}>DRIVER CONSOLE</Text>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: barWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    width: 70,
    height: 70,
  },
  wordmarkRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  wordmarkJxt: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },
  wordmarkTap: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.orange,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.tealLight,
    marginBottom: 60,
  },
  progressTrack: {
    position: 'absolute',
    bottom: 60,
    width: 140,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.tealDark,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
  },
});

export default SplashScreen;