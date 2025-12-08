// App.js
// Главный файл приложения: здесь настраивается навигация,
// хранится состояние кликер-игры, реализовано сохранение прогресса,
// проигрывание звуков и хранение аватарки пользователя.

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Навигация
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Экраны
import ClickerScreen from './screens/ClickerScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import StatsScreen from './screens/StatsScreen';

// Хранилище
import AsyncStorage from '@react-native-async-storage/async-storage';

// Звук
import { Audio } from 'expo-av';

// Ключ, под которым будем хранить состояние игры
const GAME_STATE_KEY = 'CLICKER_GAME_STATE_V1';

// Навигатор вкладок
const Tab = createBottomTabNavigator();

/**
 * Главный компонент приложения.
 */
export default function App() {
  // --- Состояние игры ---
  const [coins, setCoins] = useState(0);
  const [coinsPerClick, setCoinsPerClick] = useState(1);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  // URI аватарки пользователя (локальный путь к выбранной картинке)
  const [avatarUri, setAvatarUri] = useState(null);

  // Флаг: загружены ли данные из хранилища
  const [isLoaded, setIsLoaded] = useState(false);

  // Звуки
  const [coinSound, setCoinSound] = useState(null);
  const [upgradeSound, setUpgradeSound] = useState(null);

  // -------- Загрузка состояния при старте --------
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);

        if (savedState != null) {
          const parsed = JSON.parse(savedState);

          setCoins(parsed.coins ?? 0);
          setCoinsPerClick(parsed.coinsPerClick ?? 1);
          setTotalClicks(parsed.totalClicks ?? 0);
          setTotalEarned(parsed.totalEarned ?? 0);
          setAvatarUri(parsed.avatarUri ?? null);
        }
      } catch (error) {
        console.warn('Не удалось загрузить состояние игры:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadGameState();
  }, []);

  // -------- Сохранение состояния при изменении --------
  useEffect(() => {
    if (!isLoaded) return;

    const saveGameState = async () => {
      try {
        const stateToSave = {
          coins,
          coinsPerClick,
          totalClicks,
          totalEarned,
          avatarUri,
        };

        await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Не удалось сохранить состояние игры:', error);
      }
    };

    saveGameState();
  }, [coins, coinsPerClick, totalClicks, totalEarned, avatarUri, isLoaded]);

  // -------- Загрузка звуков --------
  useEffect(() => {
    let coinSoundRef;
    let upgradeSoundRef;

    const loadSounds = async () => {
      try {
        const coinResult = await Audio.Sound.createAsync(
          require('./assets/sounds/coin-click.mp3')
        );
        const upgradeResult = await Audio.Sound.createAsync(
          require('./assets/sounds/upgrade.mp3')
        );

        coinSoundRef = coinResult.sound;
        upgradeSoundRef = upgradeResult.sound;

        setCoinSound(coinResult.sound);
        setUpgradeSound(upgradeResult.sound);
      } catch (error) {
        console.warn(
          'Не удалось загрузить звуки. Проверьте, что файлы лежат в assets/sounds.',
          error
        );
      }
    };

    loadSounds();

    return () => {
      if (coinSoundRef) {
        coinSoundRef.unloadAsync();
      }
      if (upgradeSoundRef) {
        upgradeSoundRef.unloadAsync();
      }
    };
  }, []);

  // -------- Вспомогательные функции для звука --------
  const playCoinSound = async () => {
    if (!coinSound) return;
    try {
      await coinSound.replayAsync();
    } catch (error) {
      console.warn('Ошибка при проигрывании звука клика:', error);
    }
  };

  const playUpgradeSound = async () => {
    if (!upgradeSound) return;
    try {
      await upgradeSound.replayAsync();
    } catch (error) {
      console.warn('Ошибка при проигрывании звука улучшения:', error);
    }
  };

  // -------- Логика кликера --------

  const handleCoinClick = () => {
    setCoins(prev => prev + coinsPerClick);
    setTotalClicks(prev => prev + 1);
    setTotalEarned(prev => prev + coinsPerClick);
    playCoinSound();
  };

  const handleUpgradeIncome = (cost, bonus) => {
    if (coins < cost) {
      return;
    }

    setCoins(prev => prev - cost);
    setCoinsPerClick(prev => prev + bonus);
    playUpgradeSound();
  };

  // Пока данные загружаются — показываем экран загрузки
  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f4f4f4',
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>Загрузка данных...</Text>
      </View>
    );
  }

  // -------- Навигация с иконками вкладок --------

  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          tabBarIcon: ({ focused, size }) => {
            let iconSource;

            if (route.name === 'Кликер') {
              iconSource = require('./assets/images/tab-clicker.png');
            } else if (route.name === 'Прокачка') {
              iconSource = require('./assets/images/tab-upgrade.png');
            } else if (route.name === 'Статистика') {
              iconSource = require('./assets/images/tab-stats.png');
            }

            return (
              <Image
                source={iconSource}
                style={{
                  width: size + 4,
                  height: size + 4,
                  opacity: focused ? 1 : 0.5,
                }}
                resizeMode="contain"
              />
            );
          },
        })}
      >
        {/* Главный экран с монеткой */}
        <Tab.Screen name="Кликер">
          {() => (
            <ClickerScreen
              coins={coins}
              coinsPerClick={coinsPerClick}
              onCoinClick={handleCoinClick}
            />
          )}
        </Tab.Screen>

        {/* Экран с прокачкой дохода */}
        <Tab.Screen name="Прокачка">
          {() => (
            <UpgradeScreen
              coins={coins}
              coinsPerClick={coinsPerClick}
              onUpgradeIncome={handleUpgradeIncome}
            />
          )}
        </Tab.Screen>

        {/* Экран со статистикой игрока + аватарка */}
        <Tab.Screen name="Статистика">
          {() => (
            <StatsScreen
              coins={coins}
              coinsPerClick={coinsPerClick}
              totalClicks={totalClicks}
              totalEarned={totalEarned}
              avatarUri={avatarUri}
              onChangeAvatar={setAvatarUri}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
