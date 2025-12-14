// screens/UpgradeScreen.js
// Экран прокачки: активный доход (за клик) и пассивный доход.

import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import UpgradeCard from '../components/UpgradeCard';

export default function UpgradeScreen({
  coins,
  coinsPerClick,
  passiveIncomePerMinute,
  onRequestUpgrade, // <-- вместо прямой покупки
}) {
  // ---------- Активный доход (за клик) ----------
  const smallCost = Math.max(10, coinsPerClick * 5);
  const smallBonus = Math.max(1, Math.round(coinsPerClick * 0.5));

  const mediumCost = Math.max(50, coinsPerClick * 10);
  const mediumBonus = Math.max(2, Math.round(coinsPerClick * 0.8));

  const bigCost = Math.max(150, coinsPerClick * 15);
  const bigBonus = Math.max(3, Math.round(coinsPerClick * 1.2));

  // ---------- Пассивный доход (монет/мин) ----------
  const base = Math.max(1, passiveIncomePerMinute + 1);

  const pSmallCost = Math.max(40, base * 25);
  const pSmallBonus = Math.max(1, Math.round(base * 0.5));

  const pMediumCost = Math.max(120, base * 45);
  const pMediumBonus = Math.max(2, Math.round(base * 0.9));

  const pBigCost = Math.max(300, base * 75);
  const pBigBonus = Math.max(4, Math.round(base * 1.3));

  return (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.title}>Прокачка</Text>

      <Text style={styles.label}>Баланс: {coins} монет</Text>
      <Text style={styles.label}>Доход за клик: {coinsPerClick}</Text>
      <Text style={styles.label}>Пассивный доход: {passiveIncomePerMinute} мон/мин</Text>

      <Text style={styles.section}>Улучшения дохода за клик (мини-игры чередуются: уравнение ↔ крестики-нолики)</Text>

      <UpgradeCard
        title="Малое улучшение"
        description="Небольшое увеличение дохода."
        cost={smallCost}
        bonus={smallBonus}
        bonusLabel="за клик"
        coins={coins}
        imageSource={require('../assets/images/upgrade-small.png')}
        onPress={() =>
          onRequestUpgrade({
            type: 'click',
            title: 'Малое улучшение',
            cost: smallCost,
            bonus: smallBonus,
          })
        }
      />

      <UpgradeCard
        title="Среднее улучшение"
        description="Хороший баланс цены и прибыли."
        cost={mediumCost}
        bonus={mediumBonus}
        bonusLabel="за клик"
        coins={coins}
        imageSource={require('../assets/images/upgrade-medium.png')}
        onPress={() =>
          onRequestUpgrade({
            type: 'click',
            title: 'Среднее улучшение',
            cost: mediumCost,
            bonus: mediumBonus,
          })
        }
      />

      <UpgradeCard
        title="Крупное улучшение"
        description="Сильный прирост, но дорого."
        cost={bigCost}
        bonus={bigBonus}
        bonusLabel="за клик"
        coins={coins}
        imageSource={require('../assets/images/upgrade-big.png')}
        onPress={() =>
          onRequestUpgrade({
            type: 'click',
            title: 'Крупное улучшение',
            cost: bigCost,
            bonus: bigBonus,
          })
        }
      />

      <Text style={[styles.section, { marginTop: 22 }]}>
        Пассивный доход (мини-игры чередуются: пример ↔ сапёр)
      </Text>

      <UpgradeCard
        title="Малый пассивный доход"
        description="Добавляет монеты автоматически."
        cost={pSmallCost}
        bonus={pSmallBonus}
        bonusLabel="мон/мин"
        coins={coins}
        // чтобы не требовать новых картинок — используем те же
        imageSource={require('../assets/images/upgrade-small.png')}
        onPress={() =>
          onRequestUpgrade({
            type: 'passive',
            title: 'Малый пассивный доход',
            cost: pSmallCost,
            bonus: pSmallBonus,
          })
        }
      />

      <UpgradeCard
        title="Средний пассивный доход"
        description="Ускоряет накопление монет."
        cost={pMediumCost}
        bonus={pMediumBonus}
        bonusLabel="мон/мин"
        coins={coins}
        imageSource={require('../assets/images/upgrade-medium.png')}
        onPress={() =>
          onRequestUpgrade({
            type: 'passive',
            title: 'Средний пассивный доход',
            cost: pMediumCost,
            bonus: pMediumBonus,
          })
        }
      />

      <UpgradeCard
        title="Крупный пассивный доход"
        description="Очень быстрый рост пассивного дохода."
        cost={pBigCost}
        bonus={pBigBonus}
        bonusLabel="мон/мин"
        coins={coins}
        imageSource={require('../assets/images/upgrade-big.png')}
        onPress={() =>
          onRequestUpgrade({
            type: 'passive',
            title: 'Крупный пассивный доход',
            cost: pBigCost,
            bonus: pBigBonus,
          })
        }
      />

      <Text style={styles.hint}>
        Важно: монеты списываются всегда после мини-игры. Улучшение выдаётся только при успехе.
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
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 16, marginTop: 4, alignSelf: 'flex-start' },
  section: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
  hint: { marginTop: 18, fontSize: 13, color: '#555', textAlign: 'center' },
});
