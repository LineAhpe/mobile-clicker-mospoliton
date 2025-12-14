// components/MinesweeperModal.js
// Мини-сапёр: 6x6, 5 мин.
// Управление: режим "Открыть" / "Флаг".
// Успех = открыть все безопасные клетки. Провал = открыть мину.
//
// ВАЖНО: мины расставляются только после первого открытия клетки.
// Первая открытая клетка и её окружение 3x3 гарантированно без мин,
// поэтому первое открытие всегда раскрывает несколько клеток.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../theme';

const ROWS = 6;
const COLS = 6;
const MINES = 5;

function idx(r, c) {
  return r * COLS + c;
}

function inBounds(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

function neighbors(r, c) {
  const res = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc)) res.push([nr, nc]);
    }
  }
  return res;
}

function makeEmptyBoard() {
  return Array.from({ length: ROWS * COLS }, () => ({
    isMine: false,
    revealed: false,
    flagged: false,
    adj: 0,
  }));
}

function computeAdj(cells) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = idx(r, c);
      if (cells[i].isMine) {
        cells[i].adj = 0;
        continue;
      }
      let count = 0;
      for (const [nr, nc] of neighbors(r, c)) {
        if (cells[idx(nr, nc)].isMine) count++;
      }
      cells[i].adj = count;
    }
  }
}

function safeZoneSet(centerR, centerC) {
  const set = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = centerR + dr;
      const c = centerC + dc;
      if (inBounds(r, c)) set.add(idx(r, c));
    }
  }
  return set;
}

function generateBoardAfterFirstReveal(prevCells, firstR, firstC) {
  // Сохраняем флаги, но сбрасываем мины/числа/открытие.
  const cells = prevCells.map((x) => ({
    ...x,
    isMine: false,
    revealed: false,
    adj: 0,
  }));

  const safe = safeZoneSet(firstR, firstC);

  // Ставим мины вне safe-зоны.
  const used = new Set();
  const total = ROWS * COLS;
  while (used.size < MINES) {
    const p = Math.floor(Math.random() * total);
    if (safe.has(p)) continue;
    used.add(p);
  }
  for (const p of used) cells[p].isMine = true;

  computeAdj(cells);
  return cells;
}

export default function MinesweeperModal({ visible, onCancel, onResult }) {
  const [cells, setCells] = useState(makeEmptyBoard());
  const [mode, setMode] = useState('reveal'); // reveal | flag
  const [finished, setFinished] = useState(false);
  const generatedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;
    setCells(makeEmptyBoard());
    setMode('reveal');
    setFinished(false);
    generatedRef.current = false;
  }, [visible]);

  const revealedSafeCount = useMemo(() => {
    let count = 0;
    for (const c of cells) if (c.revealed && !c.isMine) count++;
    return count;
  }, [cells]);

  const safeTotal = ROWS * COLS - MINES;

  useEffect(() => {
    if (!visible) return;
    if (finished) return;

    if (revealedSafeCount >= safeTotal) {
      setFinished(true);
      onResult(true);
    }
  }, [revealedSafeCount, safeTotal, finished, onResult, visible]);

  const revealFlood = (startR, startC, draft) => {
    const stack = [[startR, startC]];
    while (stack.length) {
      const [r, c] = stack.pop();
      const i = idx(r, c);
      const cell = draft[i];
      if (cell.revealed || cell.flagged) continue;

      cell.revealed = true;

      // если 0 — открываем соседей
      if (cell.adj === 0) {
        for (const [nr, nc] of neighbors(r, c)) {
          const ni = idx(nr, nc);
          if (!draft[ni].revealed && !draft[ni].isMine) {
            stack.push([nr, nc]);
          }
        }
      }
    }
  };

  const pressCell = (r, c) => {
    if (finished) return;

    setCells((prev) => {
      let next = prev.map((x) => ({ ...x }));
      const i = idx(r, c);
      let cell = next[i];

      if (cell.revealed) return prev;

      if (mode === 'flag') {
        cell.flagged = !cell.flagged;
        return next;
      }

      // mode === 'reveal'
      if (cell.flagged) return prev;

      // Генерация мин после первого открытия (и safe-зона 3x3)
      if (!generatedRef.current) {
        next = generateBoardAfterFirstReveal(next, r, c);
        generatedRef.current = true;
        cell = next[i];
      }

      if (cell.isMine) {
        // проигрыш: показываем мины
        for (const cc of next) {
          if (cc.isMine) cc.revealed = true;
        }
        setFinished(true);
        // провал
        setTimeout(() => onResult(false), 0);
        return next;
      }

      // Всегда используем flood: для чисел откроется только сама клетка,
      // для 0 откроется область.
      revealFlood(r, c, next);

      return next;
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Мини-игра: Сапёр</Text>
          <Text style={styles.hint}>
            Условие успеха — открыть все безопасные клетки. Взрыв на мине = провал.
          </Text>

          <View style={styles.topRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'reveal' && styles.modeBtnActive]}
              onPress={() => setMode('reveal')}
            >
              <Text style={[styles.modeText, mode === 'reveal' && styles.modeTextActive]}>
                Открыть
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeBtn, mode === 'flag' && styles.modeBtnActive]}
              onPress={() => setMode('flag')}
            >
              <Text style={[styles.modeText, mode === 'flag' && styles.modeTextActive]}>
                Флаг
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />
            <Text style={styles.counter}>
              {revealedSafeCount}/{safeTotal}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View style={styles.grid}>
              {Array.from({ length: ROWS }).map((_, r) => (
                <View key={`row-${r}`} style={styles.row}>
                  {Array.from({ length: COLS }).map((__, c) => {
                    const i = idx(r, c);
                    const cell = cells[i];

                    let text = '';
                    if (cell.revealed) {
                      if (cell.isMine) text = '💣';
                      else if (cell.adj > 0) text = String(cell.adj);
                    } else if (cell.flagged) {
                      text = '🚩';
                    }

                    return (
                      <TouchableOpacity
                        key={`${r}-${c}`}
                        style={[
                          styles.cell,
                          cell.revealed ? styles.cellRevealed : styles.cellHidden,
                        ]}
                        onPress={() => pressCell(r, c)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.cellText}>{text}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
            <Text style={styles.btnTextGhost}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const CELL = 28;

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
    maxWidth: 460,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    maxHeight: '90%',
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  hint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },

  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    backgroundColor: 'transparent',
  },
  modeBtnActive: { backgroundColor: COLORS.primary },
  modeText: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 12 },
  modeTextActive: { color: '#fff' },
  counter: { color: COLORS.textSecondary, fontWeight: '700' },

  grid: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row' },
  cell: {
    width: CELL,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.borderSubtle,
  },
  // заметно отличаем открытую клетку от закрытой
  cellHidden: { backgroundColor: COLORS.backgroundAlt },
  cellRevealed: { backgroundColor: COLORS.card },
  cellText: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary },

  btn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnGhost: { borderWidth: 1, borderColor: COLORS.borderSubtle, backgroundColor: 'transparent' },
  btnTextGhost: { color: COLORS.textPrimary, fontWeight: '700' },
});
