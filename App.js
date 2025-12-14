// App.js
// Главный файл приложения: навигация, состояние кликера, сохранение прогресса,
// пассивный доход (онлайн без ограничений, офлайн только 3 часа),
// звуки, аватарка, и мини-игры для прокачки.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
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

// Тема
import { COLORS } from './theme';

// Мини-игры (создай эти файлы в components/)
import MathChallengeModal from './components/MathChallengeModal';
import TicTacToeModal from './components/TicTacToeModal';
import MinesweeperModal from './components/MinesweeperModal';

const Tab = createBottomTabNavigator();
const GAME_STATE_KEY = 'CLICKER_GAME_STATE_V2';

export default function App() {
  // --- Состояние игры ---
  const [coins, setCoins] = useState(0);
  const [coinsPerClick, setCoinsPerClick] = useState(1);

  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  // Пассивный доход (монет в минуту)
  const [passiveIncomePerMinute, setPassiveIncomePerMinute] = useState(0);

  // Буфер дробных монет для пассивного дохода (для начисления каждые 3 секунды)
  const [passiveBuffer, setPassiveBuffer] = useState(0);

  // Аватарка
  const [avatarUri, setAvatarUri] = useState(null);

  // Очередь мини-игр (чередование)
  const [nextClickMiniGame, setNextClickMiniGame] = useState('equation'); // equation <-> ttt
  const [nextPassiveMiniGame, setNextPassiveMiniGame] = useState('example'); // example <-> mines

  // Модалки мини-игр
  const [pendingUpgrade, setPendingUpgrade] = useState(null);
  // pendingUpgrade: { type: 'click'|'passive', cost: number, bonus: number }

  const [activeMiniGame, setActiveMiniGame] = useState(null);
  // 'equation' | 'example' | 'ttt' | 'mines' | null

  // Toast (уведомление на 2 секунды)
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);

  // Загрузка/готовность
  const [isLoaded, setIsLoaded] = useState(false);

  // Звуки
  const [coinSound, setCoinSound] = useState(null);
  const [upgradeSound, setUpgradeSound] = useState(null);

  const showToast = (text) => {
    setToastText(text);
    setToastVisible(true);

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
      setToastText('');
    }, 2000);
  };

  // -------- Загрузка состояния при старте --------
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);

        if (savedState) {
          let parsed;
          try {
            parsed = JSON.parse(savedState);
          } catch (e) {
            console.warn('Сохранение повреждено, сбрасываем состояние:', e);
            parsed = null;
          }

          if (parsed) {
            let coinsFromSave = parsed.coins ?? 0;
            let totalEarnedFromSave = parsed.totalEarned ?? 0;

            const passiveFromSave = parsed.passiveIncomePerMinute ?? 0;
            let bufferFromSave = parsed.passiveBuffer ?? 0;

            // --- Офлайн доход: учитываем только первые 3 часа ---
            if (parsed.lastActiveAt && passiveFromSave > 0) {
              try {
                const last = new Date(parsed.lastActiveAt);
                const now = new Date();
                const diffMs = now.getTime() - last.getTime();

                if (diffMs > 0 && Number.isFinite(diffMs)) {
                  const threeHoursMs = 3 * 60 * 60 * 1000;
                  const effectiveMs = Math.min(diffMs, threeHoursMs);
                  const offlineMinutes = effectiveMs / (60 * 1000);

                  const offlineDelta = offlineMinutes * passiveFromSave; // может быть дробным

                  const total = bufferFromSave + offlineDelta;
                  const addInt = Math.floor(total);
                  bufferFromSave = total - addInt;

                  if (addInt > 0) {
                    coinsFromSave += addInt;
                    totalEarnedFromSave += addInt;
                  }
                }
              } catch (e) {
                console.warn('Ошибка расчёта офлайн-дохода:', e);
              }
            }

            setCoins(coinsFromSave);
            setCoinsPerClick(parsed.coinsPerClick ?? 1);
            setTotalClicks(parsed.totalClicks ?? 0);
            setTotalEarned(totalEarnedFromSave);

            setPassiveIncomePerMinute(passiveFromSave);
            setPassiveBuffer(bufferFromSave);

            setAvatarUri(parsed.avatarUri ?? null);

            // очередь мини-игр (чтобы после перезапуска чередование сохранялось)
            setNextClickMiniGame(parsed.nextClickMiniGame ?? 'equation');
            setNextPassiveMiniGame(parsed.nextPassiveMiniGame ?? 'example');
          }
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
          passiveIncomePerMinute,
          passiveBuffer,

          // очередь мини-игр
          nextClickMiniGame,
          nextPassiveMiniGame,

          // время последней активности — для офлайн-дохода
          lastActiveAt: new Date().toISOString(),
        };

        await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Не удалось сохранить состояние игры:', error);
      }
    };

    saveGameState();
  }, [
    isLoaded,
    coins,
    coinsPerClick,
    totalClicks,
    totalEarned,
    avatarUri,
    passiveIncomePerMinute,
    passiveBuffer,
    nextClickMiniGame,
    nextPassiveMiniGame,
  ]);

  // -------- Загрузка звуков --------
  useEffect(() => {
    let coinSoundRef;
    let upgradeSoundRef;

    const loadSounds = async () => {
      try {
        // ВАЖНО: файлы должны существовать, иначе сборка упадёт.
        const coinResult = await Audio.Sound.createAsync(
          require('./assets/sounds/coin-click.mp3')
        );
        const upgradeResult = await Audio.Sound.createAsync(
          require('./assets/sounds/upgrade.mp3')
        );

        coinSoundRef = coinResult.sound;
        upgradeSoundRef = upgradeResult.sound;

        setCoinSound(coinSoundRef);
        setUpgradeSound(upgradeSoundRef);
      } catch (error) {
        console.warn(
          'Не удалось загрузить звуки. Проверьте assets/sounds/coin-click.mp3 и assets/sounds/upgrade.mp3',
          error
        );
      }
    };

    loadSounds();

    return () => {
      if (coinSoundRef) coinSoundRef.unloadAsync();
      if (upgradeSoundRef) upgradeSoundRef.unloadAsync();
    };
  }, []);

  const playCoinSound = async () => {
    if (!coinSound) return;
    try {
      await coinSound.replayAsync();
    } catch (e) {
      console.warn('Ошибка воспроизведения coinSound:', e);
    }
  };

  const playUpgradeSound = async () => {
    if (!upgradeSound) return;
    try {
      await upgradeSound.replayAsync();
    } catch (e) {
      console.warn('Ошибка воспроизведения upgradeSound:', e);
    }
  };

  // -------- Онлайн пассивный доход каждые 3 секунды (без ограничений) --------
  useEffect(() => {
    if (!isLoaded) return;

    const intervalMs = 3000;

    const id = setInterval(() => {
      if (passiveIncomePerMinute <= 0) return;

      // монет за 3 секунды (может быть дробным)
      const delta = (passiveIncomePerMinute * intervalMs) / 60000;

      setPassiveBuffer((prevBuf) => {
        const total = prevBuf + delta;
        const addInt = Math.floor(total);

        if (addInt > 0) {
          setCoins((c) => c + addInt);
          setTotalEarned((t) => t + addInt);
        }

        return total - addInt;
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [isLoaded, passiveIncomePerMinute]);

  // -------- Логика кликера --------
  const handleCoinClick = () => {
    setCoins((prev) => prev + coinsPerClick);
    setTotalClicks((prev) => prev + 1);
    setTotalEarned((prev) => prev + coinsPerClick);
    playCoinSound();
  };

  // --- Запрос прокачки: сначала мини-игра, потом (успех/провал) ---
  const requestUpgrade = (type, cost, bonus) => {
    // защита от двойных нажатий, пока идёт мини-игра
    if (pendingUpgrade || activeMiniGame) return;
    if (coins < cost) return;

    if (type !== 'click' && type !== 'passive') {
      console.warn('Неизвестный тип улучшения:', type);
      return;
    }

    setPendingUpgrade({ type, cost, bonus });

    if (type === 'click') {
      setActiveMiniGame(nextClickMiniGame); // equation <-> ttt
    } else {
      setActiveMiniGame(nextPassiveMiniGame); // example <-> mines
    }
  };

  const handleRequestUpgrade = (payload) => {
    if (!payload) return;
    requestUpgrade(payload.type, payload.cost, payload.bonus);
  };

  // Результат мини-игры: списываем монеты всегда, прокачку даём только при успехе
  const finishMiniGame = (success) => {
    const pu = pendingUpgrade;
    if (!pu) {
      setActiveMiniGame(null);
      return;
    }

    // списание монет
    setCoins((c) => Math.max(0, c - pu.cost));

    if (success) {
      if (pu.type === 'click') {
        setCoinsPerClick((v) => v + pu.bonus);
      } else {
        setPassiveIncomePerMinute((v) => v + pu.bonus);
      }
      playUpgradeSound();
      showToast('✅ Мини-игра пройдена! Улучшение получено.');
    } else {
      showToast('❌ Мини-игра провалена. Монеты списаны.');
    }

    // чередование мини-игр (только если попытка реально завершилась)
    if (pu.type === 'click') {
      setNextClickMiniGame((prev) => (prev === 'equation' ? 'ttt' : 'equation'));
    } else {
      setNextPassiveMiniGame((prev) => (prev === 'example' ? 'mines' : 'example'));
    }

    setPendingUpgrade(null);
    setActiveMiniGame(null);
  };

  const cancelMiniGame = () => {
    // Отмена = не покупаем улучшение, ничего не списываем
    setPendingUpgrade(null);
    setActiveMiniGame(null);
  };

  const mathMode = useMemo(() => {
    if (activeMiniGame === 'equation') return 'equation';
    if (activeMiniGame === 'example') return 'example';
    return null;
  }, [activeMiniGame]);

  // Пока загружаем данные
  if (!isLoaded) {
    return (
      <View style={[styles.loader, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.textPrimary }}>
          Загрузка данных...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />

        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: true,
            headerStyle: { backgroundColor: COLORS.background },
            headerTitleStyle: { color: COLORS.textPrimary, fontWeight: '700' },
            headerTintColor: COLORS.primary,

            tabBarStyle: {
              backgroundColor: COLORS.backgroundAlt,
              borderTopColor: COLORS.borderSubtle,
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.textSecondary,

            tabBarIcon: ({ focused, size, color }) => {
              let iconSource;

              // ВАЖНО: файлы должны существовать (иначе сборка упадёт).
              if (route.name === 'Кликер') iconSource = require('./assets/images/tab-clicker.png');
              if (route.name === 'Прокачка') iconSource = require('./assets/images/tab-upgrade.png');
              if (route.name === 'Статистика') iconSource = require('./assets/images/tab-stats.png');

              return (
                <Image
                  source={iconSource}
                  style={{
                    width: size + 4,
                    height: size + 4,
                    opacity: focused ? 1 : 0.85,
                    tintColor: color,
                  }}
                  resizeMode="contain"
                />
              );
            },
          })}
        >
          <Tab.Screen name="Кликер">
            {() => (
              <ClickerScreen
                coins={coins}
                coinsPerClick={coinsPerClick}
                passiveIncomePerMinute={passiveIncomePerMinute}
                onCoinClick={handleCoinClick}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Прокачка">
            {() => (
              <UpgradeScreen
                coins={coins}
                coinsPerClick={coinsPerClick}
                passiveIncomePerMinute={passiveIncomePerMinute}
                onRequestUpgrade={handleRequestUpgrade}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Статистика">
            {() => (
              <StatsScreen
                coins={coins}
                coinsPerClick={coinsPerClick}
                totalClicks={totalClicks}
                totalEarned={totalEarned}
                passiveIncomePerMinute={passiveIncomePerMinute}
                avatarUri={avatarUri}
                onChangeAvatar={setAvatarUri}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>

        {/* Toast (2 секунды) */}
        {toastVisible && (
          <View style={styles.toastWrap} pointerEvents="none">
            <View style={styles.toastCard}>
              <Text style={styles.toastText}>{toastText}</Text>
            </View>
          </View>
        )}

        {/* Мини-игра: уравнения/примеры */}
        <MathChallengeModal
          visible={activeMiniGame === 'equation' || activeMiniGame === 'example'}
          mode={mathMode}
          onCancel={cancelMiniGame}
          onResult={finishMiniGame}
        />

        {/* Мини-игра: крестики-нолики (успех = ничья) */}
        <TicTacToeModal
          visible={activeMiniGame === 'ttt'}
          onCancel={cancelMiniGame}
          onResult={finishMiniGame}
        />

        {/* Мини-игра: сапёр (успех = разминировать всё) */}
        <MinesweeperModal
          visible={activeMiniGame === 'mines'}
          onCancel={cancelMiniGame}
          onResult={finishMiniGame}
        />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  toastWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    maxWidth: '90%',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
