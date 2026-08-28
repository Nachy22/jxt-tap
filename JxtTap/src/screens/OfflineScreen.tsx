import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';

// Mock data for now — will be replaced with real offline queue data (Step 13)
const offlineData = {
  queuedCount: 3,
  lastSynced: '2 hours ago',
  queuedTransactions: [
    { id: '3847', time: '14:45', fare: 8 },
    { id: '2201', time: '14:52', fare: 10 },
  ],
};

const OfflineScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconCircle}>
          <View style={styles.wifiOffIcon}>
            <View style={styles.wifiArc} />
            <View style={styles.slash} />
          </View>
        </View>

        <Text style={styles.title}>You're offline</Text>
        <Text style={styles.subtitle}>
          Payments are still being accepted.{'\n'}Everything will sync when
          you reconnect.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Transactions queued</Text>
              <Text style={styles.summaryValue}>
                {offlineData.queuedCount}
              </Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>PENDING SYNC</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.lastSyncedRow}>
            <Text style={styles.lastSyncedLabel}>Last synced</Text>
            <Text style={styles.lastSyncedValue}>
              {offlineData.lastSynced}
            </Text>
          </View>
        </View>

        <View style={styles.queuedCard}>
          <Text style={styles.queuedTitle}>Queued transactions</Text>

          {offlineData.queuedTransactions.map((tx, index) => (
            <View
              key={tx.id}
              style={[
                styles.queuedRow,
                index === offlineData.queuedTransactions.length - 1 &&
                  styles.queuedRowLast,
              ]}
            >
              <View style={styles.queuedRowLeft}>
                <View style={styles.pendingDot} />
                <View>
                  <Text style={styles.queuedId}>•••• {tx.id}</Text>
                  <Text style={styles.queuedTime}>{tx.time}</Text>
                </View>
              </View>
              <Text style={styles.queuedFare}>ETB {tx.fare}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footerNote}>
          Your device stores all fares securely. Keep collecting — you're
          covered.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  wifiOffIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wifiArc: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
    borderColor: colors.orange,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  slash: {
    position: 'absolute',
    width: 2.5,
    height: 40,
    backgroundColor: colors.orange,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.teal,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.teal,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pendingBadge: {
    backgroundColor: '#FDEBDD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orange,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  lastSyncedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastSyncedLabel: {
    fontSize: 13,
    color: colors.teal,
  },
  lastSyncedValue: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  queuedCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  queuedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  queuedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  queuedRowLast: {
    borderBottomWidth: 0,
  },
  queuedRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
    marginRight: 10,
  },
  queuedId: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  queuedTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  queuedFare: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.teal,
  },
  footerNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});

export default OfflineScreen;