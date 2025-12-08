// components/UpgradeCard.js
// Карточка одного улучшения дохода, с иконкой, описанием и кнопкой.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

/**
 * Компонент карточки улучшения.
 *
 * Пропсы:
 * - title            — заголовок улучшения
 * - description      — описание улучшения
 * - cost             — стоимость улучшения в монетах
 * - bonus            — бонус к доходу за клик
 * - coins            — текущее количество монет у игрока
 * - onUpgradeIncome  — функция, вызываемая при покупке улучшения
 * - imageSource      — источник картинки (require(...) с путём к файлу)
 */
export default function UpgradeCard({
  title,
  description,
  cost,
  bonus,
  coins,
  onUpgradeIncome,
  imageSource,
}) {
  const canBuy = coins >= cost;

  return (
    <View style={styles.card}>
      {/* Верхняя часть: иконка + текст */}
      <View style={styles.headerRow}>
        {imageSource && (
          <Image
            source={imageSource}
            style={styles.icon}
            resizeMode="contain"
          />
        )}
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <Text style={styles.info}>
        Стоимость: {cost} монет | Бонус: +{bonus} за клик
      </Text>

      <TouchableOpacity
        style={[styles.button, !canBuy && styles.buttonDisabled]}
        onPress={() => onUpgradeIncome(cost, bonus)}
        disabled={!canBuy}
      >
        <Text style={styles.buttonText}>
          {canBuy ? 'Купить улучшение' : 'Недостаточно монет'}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  info: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
