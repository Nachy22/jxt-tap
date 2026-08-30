import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { colors } from '../theme/colors';
import { readCardOnce } from '../services/NfcService';
import {
  processTransaction,
  getDriverSummary,
  getDriverInfo,
  getRouteLegs,
  setCurrentLeg,
  RouteLeg,
} from '../services/ApiService';
import { queueTransaction } from '../services/OfflineDb';
import { syncQueuedTransactions } from '../services/OfflineSync';

const driver = {
  id: 1, // matches the seeded test driver
  name: 'Tadesse Girma',
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
};

const HomeScreen = ({ navigation }: any) => {
  const pulse = useRef(new Animated.Value(0)).current;
  const [todayStats, setTodayStats] = useState({ total: '0.00', trips: 0 });
  const [routeName, setRouteName] = useState('');
  const [currentLeg, setCurrentLegLabel] = useState('Not set');
  const [routeId, setRouteId] = useState<number | null>(null);
  const [legs, setLegs] = useState<RouteLeg[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  const loadSummary = async () => {
    const summary = await getDriverSummary(driver.id);
    if (summary) {
      setTodayStats({ total: summary.total, trips: summary.trips });
    }
  };

  const loadDriverInfo = async () => {
    const info = await getDriverInfo(driver.id);
    if (info) {
      setRouteName(info.routeName ?? '');
      setCurrentLegLabel(info.currentLeg ?? 'Not set');
      setRouteId(info.routeId);
    }
  };

  useEffect(() => {
    const runSync = async () => {
      const { synced } = await syncQueuedTransactions();
      if (synced > 0) {
        Alert.alert(
          'Synced',
          `${synced} offline fare${synced > 1 ? 's' : ''} synced successfully.`,
        );
      }
      loadSummary();
      loadDriverInfo();
    };

    runSync();

    const unsubscribe = navigation.addListener('focus', runSync);
    return unsubscribe;
  }, [navigation]);

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

  const openLegPicker = async () => {
    if (!routeId) return;
    const availableLegs = await getRouteLegs(routeId);
    if (availableLegs) {
      setLegs(availableLegs);
      setPickerVisible(true);
    }
  };

  const handleSelectLeg = async (leg: RouteLeg) => {
    const success = await setCurrentLeg(
      driver.id,
      leg.fromStopId,
      leg.toStopId,
    );
    if (success) {
      setCurrentLegLabel(leg.label);
    } else {
      Alert.alert('Could not update', 'Try again in a moment');
    }
    setPickerVisible(false);
  };

  const handleScan = async () => {
    const cardId = await readCardOnce();

    if (!cardId) {
      Alert.alert('No card detected', 'Try tapping again');
      return;
    }

    const result = await processTransaction(cardId, driver.id);

    if (!result) {
      // No connection — queue this tap locally instead of failing outright
      await queueTransaction(cardId, driver.id);
      Alert.alert(
        'Saved offline',
        "No connection right now. This fare will sync automatically once you're back online.",
      );
      return;
    }

    if (result.success) {
      navigation.navigate('PaymentSuccess', {
        fare: result.fare,
        cardId: result.cardUid,
        routeStage: result.routeStage,
        remainingBalance: result.remainingBalance,
      });
    } else {
      navigation.navigate('PaymentFailed', {
        cardBalance: result.cardBalance,
        fare: result.fare,
        cardId: result.cardUid,
      });
    }
  };

  const totalParts = todayStats.total.split('.');
    return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.driverName}>{driver.name}</Text>

          <TouchableOpacity
            style={styles.routeBadge}
            onPress={openLegPicker}
            activeOpacity={0.7}
          >
            <View style={styles.routeDot} />
            <Text style={styles.routeText}>
              {routeName ? `${routeName} · ${currentLeg}` : 'Loading...'}
            </Text>
            <Text style={styles.changeHint}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Today's total card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Today's total collected</Text>
          <View style={styles.summaryRow}>
            <View style={styles.amountRow}>
              <Text style={styles.currency}>ETB</Text>
              <Text style={styles.amount}>
                {totalParts[0]}
                <Text style={styles.amountDecimal}>.{totalParts[1]}</Text>
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
              onPress={handleScan}
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
          <Text style={styles.seeAllHint}>
            Tap "See all" to view today's fares
          </Text>
        </View>
      </ScrollView>

      {/* Leg picker modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select current stage</Text>
            <FlatList
              data={legs}
              keyExtractor={item => `${item.fromStopId}-${item.toStopId}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.legRow}
                  onPress={() => handleSelectLeg(item)}
                >
                  <Text style={styles.legLabel}>{item.label}</Text>
                  <Text style={styles.legFare}>ETB {item.fare}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  changeHint: {
    fontSize: 11,
    color: colors.orange,
    fontWeight: '700',
    marginLeft: 8,
    textDecorationLine: 'underline',
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
    paddingBottom: 20,
  },
  faresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  seeAllHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  legRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  legFare: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.teal,
  },
});

export default HomeScreen;