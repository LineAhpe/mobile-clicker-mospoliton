// screens/ClickerScreen.js
// Экран с основной механикой кликера: монетка (картинка)
// и информация о текущем доходе.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

/**
 * Экран "Кликер".
 *
 * Пропсы:
 * - coins          — текущее количество монет
 * - coinsPerClick  — доход за один клик
 * - onCoinClick    — обработчик нажатия на монетку
 */
export default function ClickerScreen({ coins, coinsPerClick, onCoinClick }) {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Ферма монет</Text>

      <Text style={styles.label}>Текущий баланс:</Text>
      <Text style={styles.value}>{coins} монет</Text>

      <Text style={styles.label}>Доход за клик:</Text>
      <Text style={styles.value}>{coinsPerClick} монет</Text>

      {/* Монетка как картинка.
         Перед запуском проекта нужно положить файл
         assets/images/coin.png (путь указан относительно корня). */}
      <TouchableOpacity style={styles.coinButton} onPress={onCoinClick}>
        <Image
          source={require('../assets/images/coin.png')}
          style={styles.coinImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.hint}>
        Нажимай на монету, чтобы зарабатывать монеты и потом прокачивать доход.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  coinButton: {
    marginTop: 32,
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinImage: {
    width: 200,
    height: 200,
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});
