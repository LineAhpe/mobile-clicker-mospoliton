// components/UpgradeCard.js
// Карточка улучшения. Нажатие вызывает внешний обработчик onPress,
// т.к. покупка проходит через мини-игру.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function UpgradeCard({
  title,
  description,
  cost,
  bonus,
  bonusLabel = 'за клик',
  coins,
  onPress,
  imageSource,
}) {
  const canBuy = coins >= cost;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {imageSource && (
          <Image source={imageSource} style={styles.icon} resizeMode="contain" />
        )}
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <Text style={styles.info}>
        Стоимость: {cost} монет | Бонус: +{bonus} {bonusLabel}
      </Text>

      <TouchableOpacity
        style={[styles.button, !canBuy && styles.buttonDisabled]}
        onPress={onPress}
        disabled={!canBuy}
      >
        <Text style={styles.buttonText}>
          {canBuy ? 'Прокачать (через мини-игру)' : 'Недостаточно монет'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { width: 48, height: 48, marginRight: 12 },
  headerText: { flex: 1 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  description: { fontSize: 14, color: '#555' },
  info: { fontSize: 14, marginBottom: 8 },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#bdbdbd' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
