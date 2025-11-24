// screens/StatsScreen.js
// Экран со статистикой игрока: текущие монеты, доход за клик, общее число кликов.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Экран "Статистика".
 *
 * Пропсы:
 * - coins          — текущий баланс монет
 * - coinsPerClick  — текущий доход за клик
 * - totalClicks    — сколько кликов сделал игрок
 * - totalEarned    — сколько всего монет заработано
 */
export default function StatsScreen({
  coins,
  coinsPerClick,
  totalClicks,
  totalEarned,
}) {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Статистика игрока</Text>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Текущий баланс:</Text>
        <Text style={styles.statValue}>{coins} монет</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Доход за клик:</Text>
        <Text style={styles.statValue}>{coinsPerClick} монет</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Всего кликов:</Text>
        <Text style={styles.statValue}>{totalClicks}</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Всего заработано монет:</Text>
        <Text style={styles.statValue}>{totalEarned}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});
