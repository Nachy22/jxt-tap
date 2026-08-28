import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { readCardOnce } from '../services/NfcService';

// Mock data for now — will be replaced with real API data in Step 12
const driver = {
  name: 'Tadesse Girma',
  route: 'Route 23 · Town – Addis Ababa',
};

const todayStats = {
  total: 82.0,
  trips: 8,
};

const recentFares = [
  { id: '4821', route: 'Town → Megenagna', time: '14:32', fare: 8 },
  { id: '2934', route: 'Town → Megenagna', time: '14:18', fare: 8 },
  { id: '7761', route: 'Megenagna → CMC', time: '13:55', fare: 10 },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
};

const HomeScreen = ({ navigation }: any) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.driverName}>{driver.name}</Text>
          <View style={styles.routeBadge}>
            <View style={styles.routeDot} />
            <Text style={styles.routeText}>{driver.route}</Text>
          </View>
        </View>

        {/* Today's total card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's total collected</Text>
          <View style={styles.summaryRow}>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>ETB</Text>
              <Text style={styles.amount}>
                {todayStats.total.toFixed(2).split('.')[0]}
                <Text style={styles.amountDecimal}>
                  .{todayStats.total.toFixed(2).split('.')[1]}
                </Text>
              </Text>
            </View>
            <View style={styles.tripsBox}>
              <Text style={styles.tripsLabel}>trips today</Text>
              <Text style={styles.tripsCount}>{todayStats.trips}</Text>
            </View>
          </View>
        </View>

        {/* Scan button */}
        <View style={styles.scanButton}>
          <View style={styles.scanIconWrap}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: ringScale }],
                  opacity: ringOpacity,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.scanIconBox}
              activeOpacity={0.85}
              onPress={async () => {
                const cardId = await readCardOnce();

                if (cardId) {
                  navigation.navigate('PaymentSuccess', { cardId });
                } else {
                  Alert.alert('No card detected', 'Try tapping again');
                }
              }}
            >
              <View style={styles.viewfinder}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.scanTitle}>Ready to scan</Text>
              <Text style={styles.scanSubtitle}>NFC · QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent fares */}
        <View style={styles.faresCard}>
          <View style={styles.faresHeader}>
            <Text style={styles.faresTitle}>Recent fares</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TransactionHistory')}
            >
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentFares.map((fare, index) => (
            <View
              key={fare.id}
              style={[
                styles.fareRow,
                index === recentFares.length - 1 && styles.fareRowLast,
              ]}
            >
              <View>
                <Text style={styles.fareId}>•••• {fare.id}</Text>
                <Text style={styles.fareRoute}>
                  {fare.route} · {fare.time}
                </Text>
              </View>
              <Text style={styles.fareAmount}>ETB {fare.fare}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.teal,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.teal,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 14,
    color: colors.tealLight,
    marginBottom: 4,
  },
  driverName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
    marginRight: 8,
  },
  routeText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.teal,
    marginRight: 6,
  },
  amount: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  amountDecimal: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tripsBox: {
    alignItems: 'flex-end',
  },
  tripsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  tripsCount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scanButton: {
    backgroundColor: colors.background,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  scanIconWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.teal,
  },
  scanIconBox: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  viewfinder: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: colors.white,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  scanSubtitle: {
    fontSize: 12,
    color: colors.tealLight,
    letterSpacing: 1,
  },
  faresCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  faresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  faresTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.teal,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fareRowLast: {
    borderBottomWidth: 0,
  },
  fareId: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  fareRoute: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.teal,
  },
});

export default HomeScreen;