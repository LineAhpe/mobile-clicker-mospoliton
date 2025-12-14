// components/ToastMessage.js
// Простое уведомление (toast) на экране на заданное время.

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function ToastMessage({ visible, message, type = 'info' }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      return;
    }

    Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  }, [visible, opacity]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <Animated.View
        style={[
          styles.toast,
          type === 'success' && styles.success,
          type === 'error' && styles.error,
          { opacity },
        ]}
      >
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    maxWidth: 420,
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  success: {
    backgroundColor: '#2e7d32',
  },
  error: {
    backgroundColor: '#c62828',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});
