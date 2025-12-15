// components/MathChallengeModal.js
// Мини-игра: ввод ответа на "уравнение" (с x) или простой пример.
// Успех = ответ верный, провал = ответ неверный.

import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../theme';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeEquation() {
  // Генерируем уравнение с целым ответом x.
  // Варианты: x + b = c, x - b = c, a*x = c, x/a = c
  const type = randInt(1, 4);

  if (type === 1) {
    const x = randInt(1, 20);
    const b = randInt(1, 20);
    const c = x + b;
    return { question: `x + ${b} = ${c}. Найди x`, answer: x };
  }

  if (type === 2) {
    const x = randInt(5, 30);
    const b = randInt(1, 15);
    const c = x - b;
    return { question: `x - ${b} = ${c}. Найди x`, answer: x };
  }

  if (type === 3) {
    const a = randInt(2, 9);
    const x = randInt(2, 12);
    const c = a * x;
    return { question: `${a} * x = ${c}. Найди x`, answer: x };
  }

  // type === 4
  const a = randInt(2, 9);
  const c = randInt(2, 12);
  const x = a * c;
  return { question: `x / ${a} = ${c}. Найди x`, answer: x };
}

function makeExample() {
  const op = ['+', '-', '*', '/'][randInt(0, 3)];
  let a = randInt(2, 30);
  let b = randInt(2, 15);

  // чтобы деление было целым
  if (op === '/') {
    b = randInt(2, 9);
    const k = randInt(2, 12);
    a = b * k;
  }

  let answer = 0;
  if (op === '+') answer = a + b;
  if (op === '-') answer = a - b;
  if (op === '*') answer = a * b;
  if (op === '/') answer = a / b;

  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function MathChallengeModal({ visible, mode, onCancel, onResult }) {
  const [input, setInput] = useState('');
  const [task, setTask] = useState({ question: '', answer: 0 });

  const title = useMemo(() => {
    if (mode === 'equation') return 'Мини-игра: уравнение';
    if (mode === 'example') return 'Мини-игра: пример';
    return 'Мини-игра';
  }, [mode]);

  useEffect(() => {
    if (!visible) return;

    setInput('');
    if (mode === 'equation') setTask(makeEquation());
    else setTask(makeExample());
  }, [visible, mode]);

  const submit = () => {
    const user = Number(String(input).replace(',', '.'));
    const ok = Number.isFinite(user) && Math.abs(user - task.answer) < 1e-9;
    onResult(ok);
    setInput('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.card}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.question}>{task.question}</Text>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Введите ответ…"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
              <Text style={styles.btnTextGhost}>Выйти (минус монеты)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={submit}>
              <Text style={styles.btnTextPrimary}>Ответить</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Если ответ неверный или вы выйдете — улучшение не выдаётся, но монеты списываются.
          </Text>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
  question: { fontSize: 16, color: COLORS.textPrimary, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.borderSubtle },
  btnTextPrimary: { color: '#fff', fontWeight: '700' },
  btnTextGhost: { color: COLORS.textPrimary, fontWeight: '700' },
  hint: { marginTop: 10, fontSize: 12, color: COLORS.textMuted },
});
