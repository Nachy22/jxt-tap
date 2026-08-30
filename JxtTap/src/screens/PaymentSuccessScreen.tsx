import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';

const PaymentSuccessScreen = ({ navigation, route }: any) => {
  const {
    fare = '0.00',
    cardId = '----',
    routeStage = '',
    remainingBalance = '0.00',
  } = route?.params ?? {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>

        <Text style={styles.receivedLabel}>Payment received</Text>

        <View style={styles.amountRow}>
          <Text style={styles.currency}>ETB</Text>
          <Text style={styles.amount}>{fare}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Card</Text>
          <Text style={styles.detailValue}>•••• •••• {cardId}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Route stage</Text>
          <Text style={styles.detailValueDark}>{routeStage}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Remaining balance</Text>
          <Text style={styles.detailValueTeal}>ETB {remainingBalance}</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.nextButtonArrow}>→</Text>
          <Text style={styles.nextButtonText}>Ready for next passenger</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    backgroundColor: colors.teal,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 56,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkMark: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '700',
  },
  receivedLabel: {
    fontSize: 15,
    color: colors.tealLight,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    marginRight: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
  },
  detailsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -24,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.orange,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValueDark: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  detailValueTeal: {
    fontSize: 15,
    color: colors.teal,
    fontWeight: '700',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  nextButton: {
    backgroundColor: colors.orange,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonArrow: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PaymentSuccessScreen;