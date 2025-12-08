// screens/UpgradeScreen.js
// Экран для прокачки дохода. Здесь игрок может покупать улучшения,
// которые увеличивают количество монет за клик. Стоимость и бонусы
// зависят от текущего дохода, чтобы каждая следующая прокачка была
// дороже и сильнее предыдущей.

import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import UpgradeCard from '../components/UpgradeCard';

/**
 * Экран "Прокачка".
 *
 * Пропсы:
 * - coins             — текущее количество монет
 * - coinsPerClick     — текущий доход за клик
 * - onUpgradeIncome   — функция, вызываемая при покупке улучшения
 */
export default function UpgradeScreen({ coins, coinsPerClick, onUpgradeIncome }) {
  // Простейшая "экономика":
  // чем выше текущий доход за клик, тем дороже и сильнее улучшение.

  // Малое улучшение: дешёвое, но скромный бонус.
  const smallCost = Math.max(10, coinsPerClick * 5);
  const smallBonus = Math.max(1, Math.round(coinsPerClick * 0.5));

  // Среднее улучшение: дороже, но даёт более заметный прирост.
  const mediumCost = Math.max(50, coinsPerClick * 10);
  const mediumBonus = Math.max(2, Math.round(coinsPerClick * 0.8));

  // Крупное улучшение: очень дорого, но даёт сильный толчок росту.
  const bigCost = Math.max(150, coinsPerClick * 15);
  const bigBonus = Math.max(3, Math.round(coinsPerClick * 1.2));

  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.title}>Прокачка дохода</Text>

      <Text style={styles.label}>Текущий баланс: {coins} монет</Text>
      <Text style={styles.label}>Текущий доход за клик: {coinsPerClick} монет</Text>

      <Text style={[styles.label, { marginTop: 16 }]}>
        Выберите улучшение. Каждая прокачка становится дороже,
        но и усиливает доход сильнее.
      </Text>

      <UpgradeCard
        title="Малое улучшение"
        description="Небольшое увеличение дохода. Подходит для старта."
        cost={smallCost}
        bonus={smallBonus}
        coins={coins}
        onUpgradeIncome={onUpgradeIncome}
        // Для появления изображения необходимо добавить файл
        // assets/images/upgrade-small.png
        imageSource={require('../assets/images/upgrade-small.png')}
      />

      <UpgradeCard
        title="Среднее улучшение"
        description="Хороший баланс между ценой и прибылью."
        cost={mediumCost}
        bonus={mediumBonus}
        coins={coins}
        onUpgradeIncome={onUpgradeIncome}
        // assets/images/upgrade-medium.png
        imageSource={require('../assets/images/upgrade-medium.png')}
      />

      <UpgradeCard
        title="Крупное улучшение"
        description="Сильно ускоряет рост дохода, но стоит дорого."
        cost={bigCost}
        bonus={bigBonus}
        coins={coins}
        onUpgradeIncome={onUpgradeIncome}
        // assets/images/upgrade-big.png
        imageSource={require('../assets/images/upgrade-big.png')}
      />

      <Text style={styles.hint}>
        В дальнейшем сюда можно добавить образовательные мини-игры
        (решение задач, головоломки и т.п.), после успешного прохождения
        которых будет открываться соответствующее улучшение.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
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
    alignSelf: 'flex-start',
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});
