// screens/StatsScreen.js
// Экран со статистикой игрока и аватаркой, которую
// можно выбрать из галереи устройства. Показывает активный и пассивный доход.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme';

/**
 * Экран "Статистика".
 *
 * Пропсы:
 * - coins                  — текущий баланс монет
 * - coinsPerClick          — текущий доход за клик
 * - totalClicks            — сколько кликов сделал игрок
 * - totalEarned            — сколько всего монет заработано
 * - passiveIncomePerMinute — пассивный доход (монет в минуту)
 * - avatarUri              — URI текущей аватарки (или null)
 * - onChangeAvatar         — функция, вызываемая при выборе новой аватарки
 */
export default function StatsScreen({
  coins,
  coinsPerClick,
  totalClicks,
  totalEarned,
  passiveIncomePerMinute,
  avatarUri,
  onChangeAvatar,
}) {
  // Обработчик выбора аватарки из галереи
  const handlePickAvatar = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Нет доступа к галерее',
          'Разрешите доступ к фотографиям в настройках, чтобы выбрать аватарку.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        onChangeAvatar(uri);
      }
    } catch (error) {
      console.warn('Ошибка при выборе аватарки:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать аватарку.');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Статистика игрока</Text>

      {/* Блок с аватаркой */}
      <View style={styles.avatarSection}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>Нет аватарки</Text>
          </View>
        )}

        <TouchableOpacity style={styles.avatarButton} onPress={handlePickAvatar}>
          <Text style={styles.avatarButtonText}>
            {avatarUri ? 'Сменить аватарку' : 'Выбрать аватарку'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Статистика */}
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Текущий баланс:</Text>
        <Text style={styles.statValue}>{coins} монет</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Доход за клик:</Text>
        <Text style={styles.statValue}>{coinsPerClick} монет</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Пассивный доход (офлайн):</Text>
        <Text style={styles.statValue}>
          {passiveIncomePerMinute} монет/мин
        </Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Всего кликов:</Text>
        <Text style={styles.statValue}>{totalClicks}</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Всего заработано монет:</Text>
        <Text style={styles.statValue}>{totalEarned}</Text>
      </View>

      <Text style={styles.hint}>
        Аватарка, статистика и параметры дохода сохраняются между перезапусками
        приложения благодаря локальному хранилищу. Пассивный доход в онлайне, и офлайн
        только за первые 3 часа офлайна.
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.borderSubtle,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  avatarButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
  },
  avatarButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primarySoft,
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.textMuted,
  },
});
