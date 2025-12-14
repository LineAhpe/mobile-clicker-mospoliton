// screens/ClickerScreen.js
// Экран с основной механикой кликера: монетка (картинка)
// и информация о текущем активном и пассивном доходе.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../theme';

/**
 * Экран "Кликер".
 *
 * Пропсы:
 * - coins                  — текущее количество монет
 * - coinsPerClick          — доход за один клик
 * - passiveIncomePerMinute — пассивный доход (монет в минуту офлайн)
 * - onCoinClick            — обработчик нажатия на монетку
 */
export default function ClickerScreen({
  coins,
  coinsPerClick,
  passiveIncomePerMinute,
  onCoinClick,
}) {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Ферма монет</Text>

      <View style={styles.statsBlock}>
        <Text style={styles.label}>Текущий баланс</Text>
        <Text style={styles.value}>{coins} монет</Text>

        <Text style={styles.label}>Доход за клик</Text>
        <Text style={styles.value}>{coinsPerClick} монет</Text>

        <Text style={styles.label}>Пассивный доход</Text>
        <Text style={styles.value}>
          {passiveIncomePerMinute} монет / мин
        </Text>
        <Text style={styles.passiveHint}>
          Пассивный доход начисляется постоянно, пока приложение открыто,
          а в офлайн-режиме учитывается только первые 3 часа.
        </Text>
      </View>

      {/* Монетка как картинка */}
      <TouchableOpacity style={styles.coinButton} onPress={onCoinClick}>
        <Image
          source={require('../assets/images/coin.png')}
          style={styles.coinImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.hint}>
        Нажимай на монету, чтобы зарабатывать монеты и открывать новые улучшения.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.textPrimary,
  },
  statsBlock: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  label: {
    fontSize: 14,
    marginTop: 6,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  passiveHint: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  coinButton: {
    marginTop: 28,
    padding: 12,
    borderRadius: 999,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  coinImage: {
    width: 190,
    height: 190,
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
});
