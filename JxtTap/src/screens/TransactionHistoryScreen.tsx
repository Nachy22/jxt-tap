import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';

// Mock data for now — will be replaced with real API data in Step 12
const dailyTotal = {
  amount: 82.0,
  trips: 8,
};

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const transactions = [
  { id: '4821', time: '14:32', route: 'Town → Megenagna', fare: 8 },
  { id: '2934', time: '14:18', route: 'Town → Megenagna', fare: 8 },
  { id: '7761', time: '13:55', route: 'Megenagna → CMC', fare: 10 },
  { id: '0192', time: '13:41', route: 'Town → CMC', fare: 15 },
  { id: '3847', time: '13:22', route: 'Town → Megenagna', fare: 8 },
  { id: '5503', time: '12:58', route: 'Megenagna → CMC', fare: 10 },
  { id: '9124', time: '12:34', route: 'Town → Megenagna', fare: 8 },
];

const TransactionHistoryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerIcon}>↺</Text>
          <Text style={styles.headerTitle}>Transaction history</Text>
        </View>
        <Text style={styles.headerDate}>{today}</Text>
      </View>

      <View style={styles.totalCard}>
        <View>
          <Text style={styles.totalLabel}>Daily total</Text>
          <View style={styles.totalAmountRow}>
            <Text style={styles.totalCurrency}>ETB</Text>
            <Text style={styles.totalAmount}>
              {dailyTotal.amount.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.tripsBox}>
          <Text style={styles.tripsLabel}>Trips</Text>
          <Text style={styles.tripsCount}>{dailyTotal.trips}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {transactions.map(tx => (
          <View key={tx.id} style={styles.txRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{tx.time}</Text>
            </View>

            <View style={styles.txDetails}>
              <Text style={styles.txId}>•• {tx.id}</Text>
              <Text style={styles.txRoute}>{tx.route}</Text>
            </View>

            <Text style={styles.txFare}>ETB {tx.fare}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.teal,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerIcon: {
    fontSize: 18,
    color: colors.white,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.white,
  },
  headerDate: {
    fontSize: 13,
    color: colors.tealLight,
  },
  totalCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -12,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  totalAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalCurrency: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
    marginRight: 6,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tripsBox: {
    alignItems: 'flex-end',
  },
  tripsLabel: {
    fontSize: 12,
    color: colors.orange,
    marginBottom: 4,
    fontWeight: '600',
  },
  tripsCount: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  timeBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 12,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
  },
  txDetails: {
    flex: 1,
  },
  txId: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  txRoute: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  txFare: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.teal,
  },
});

export default TransactionHistoryScreen;