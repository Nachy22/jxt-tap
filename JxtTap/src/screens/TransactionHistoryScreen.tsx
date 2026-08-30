import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import {
  getDriverSummary,
  getDriverTransactions,
  FareTransaction,
} from '../services/ApiService';

const driverId = 1; // matches the seeded test driver

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TransactionHistoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [dailyTotal, setDailyTotal] = useState({ amount: '0.00', trips: 0 });
  const [transactions, setTransactions] = useState<FareTransaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const [summary, txList] = await Promise.all([
        getDriverSummary(driverId),
        getDriverTransactions(driverId),
      ]);

      if (summary) {
        setDailyTotal({ amount: summary.total, trips: summary.trips });
      }
      if (txList) {
        setTransactions(txList);
      }
      setLoading(false);
    };

    load();
  }, []);

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
            <Text style={styles.totalAmount}>{dailyTotal.amount}</Text>
          </View>
        </View>
        <View style={styles.tripsBox}>
          <Text style={styles.tripsLabel}>Trips</Text>
          <Text style={styles.tripsCount}>{dailyTotal.trips}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.teal}
          style={{ marginTop: 40 }}
        />
      ) : transactions.length === 0 ? (
        <Text style={styles.emptyText}>No fares collected yet today</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {transactions.map(tx => (
            <View key={`${tx.id}-${tx.time}`} style={styles.txRow}>
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
      )}
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
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 40,
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