// screens/StatsScreen.js
// Экран со статистикой игрока и аватаркой, которую
// можно выбрать из галереи устройства.

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

/**
 * Экран "Статистика".
 *
 * Пропсы:
 * - coins          — текущий баланс монет
 * - coinsPerClick  — текущий доход за клик
 * - totalClicks    — сколько кликов сделал игрок
 * - totalEarned    — сколько всего монет заработано
 * - avatarUri      — URI текущей аватарки (или null)
 * - onChangeAvatar — функция, вызываемая при выборе новой аватарки
 */
export default function StatsScreen({
  coins,
  coinsPerClick,
  totalClicks,
  totalEarned,
  avatarUri,
  onChangeAvatar,
}) {
  // Обработчик выбора аватарки из галереи
  const handlePickAvatar = async () => {
    try {
      // Запрашиваем разрешение на доступ к медиатеке
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Нет доступа к галерее',
          'Разрешите доступ к фотографиям в настройках, чтобы выбрать аватарку.'
        );
        return;
      }

      // Открываем галерею
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // квадратная обрезка
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // Передаём выбранный URI наверх (в App),
        // он сохранится в состоянии и в AsyncStorage
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
        <Text style={styles.statLabel}>Всего кликов:</Text>
        <Text style={styles.statValue}>{totalClicks}</Text>
      </View>

      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Всего заработано монет:</Text>
        <Text style={styles.statValue}>{totalEarned}</Text>
      </View>

      <Text style={styles.hint}>
        Аватарка и статистика сохраняются между перезапусками приложения
        благодаря локальному хранилищу.
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    color: '#555',
    fontSize: 12,
  },
  avatarButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#4caf50',
  },
  avatarButtonText: {
    color: '#fff',
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
