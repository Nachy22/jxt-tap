import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';

// Mock data for now — will come from route.params once NFC/payment logic is wired up
const payment = {
  cardBalance: 6.5,
  fare: 15.0,
  cardId: '7761',
};

const PaymentFailedScreen = ({ navigation }: any) => {
  const shortfall = payment.fare - payment.cardBalance;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topSection}>
        <View style={styles.warningCircle}>
          <Text style={styles.warningMark}>!</Text>
        </View>

        <Text style={styles.title}>Insufficient balance</Text>
        <Text style={styles.subtitle}>Card cannot cover this fare</Text>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.amountBoxRow}>
          <View style={[styles.amountBox, styles.amountBoxError]}>
            <Text style={styles.amountBoxLabelError}>CARD HAS</Text>
            <Text style={styles.amountBoxCurrencyError}>ETB</Text>
            <Text style={styles.amountBoxValueError}>
              {payment.cardBalance.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.amountBox, styles.amountBoxNeutral]}>
            <Text style={styles.amountBoxLabelNeutral}>FARE IS</Text>
            <Text style={styles.amountBoxCurrencyNeutral}>ETB</Text>
            <Text style={styles.amountBoxValueNeutral}>
              {payment.fare.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.shortfallBanner}>
          <Text style={styles.shortfallIcon}>ⓘ</Text>
          <Text style={styles.shortfallText}>
            Needs ETB {shortfall.toFixed(2)} more to travel
          </Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Card</Text>
          <Text style={styles.cardValue}>•••• {payment.cardId}</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.tryAgainButton}
          activeOpacity={0.85}
          onPress={() => {
            // Re-triggers card scan — hooks into NFC logic in Step 8
          }}
        >
          <Text style={styles.tryAgainText}>Try another card</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          activeOpacity={0.7}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.skipText}>Skip this passenger</Text>
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
    backgroundColor: '#FCEEEE',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  warningCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.error,
    backgroundColor: '#FCEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  warningMark: {
    fontSize: 30,
    color: colors.error,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.error,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: -16,
    borderRadius: 16,
    padding: 16,
  },
  amountBoxRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  amountBox: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
  },
  amountBoxError: {
    backgroundColor: '#FCEEEE',
  },
  amountBoxNeutral: {
    backgroundColor: colors.background,
  },
  amountBoxLabelError: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  amountBoxLabelNeutral: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  amountBoxCurrencyError: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
  amountBoxCurrencyNeutral: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  amountBoxValueError: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.error,
  },
  amountBoxValueNeutral: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  shortfallBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEEEE',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  shortfallIcon: {
    fontSize: 15,
    color: colors.error,
    marginRight: 8,
  },
  shortfallText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardLabel: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  tryAgainButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  tryAgainText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PaymentFailedScreen;