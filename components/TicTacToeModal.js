// components/TicTacToeModal.js
// Крестики-нолики: игрок (X) ходит первым.
// Компьютер (O) играет minimax (идеально): проиграть не может, стремится победить.
// Успех = ничья. Провал = победа компьютера.

import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const LINES = [
  [0, 1, 2],[3, 4, 5],[6, 7, 8],
  [0, 3, 6],[1, 4, 7],[2, 5, 8],
  [0, 4, 8],[2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return 'draw';
  return null;
}

function availableMoves(board) {
  const moves = [];
  for (let i = 0; i < 9; i++) if (!board[i]) moves.push(i);
  return moves;
}

// minimax: O максимизирует, X минимизирует
function minimax(board, isOTurn) {
  const w = getWinner(board);
  if (w === 'O') return { score: 1 };
  if (w === 'X') return { score: -1 };
  if (w === 'draw') return { score: 0 };

  const moves = availableMoves(board);

  let best = { score: isOTurn ? -Infinity : Infinity, move: null };

  for (const m of moves) {
    const next = board.slice();
    next[m] = isOTurn ? 'O' : 'X';
    const res = minimax(next, !isOTurn);
    const candidate = { score: res.score, move: m };

    if (isOTurn) {
      if (candidate.score > best.score) best = candidate;
    } else {
      if (candidate.score < best.score) best = candidate;
    }
  }
  return best;
}

export default function TicTacToeModal({ visible, onCancel, onResult }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X'); // X - игрок, O - бот
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setBoard(Array(9).fill(null));
    setTurn('X');
    setFinished(false);
  }, [visible]);

  const status = useMemo(() => getWinner(board), [board]);

  useEffect(() => {
    if (!visible) return;

    if (status && !finished) {
      setFinished(true);

      // успех = ничья, провал = победа O
      if (status === 'draw') onResult(true);
      else if (status === 'O') onResult(false);
      else onResult(false); // победа X не должна случаться при идеальном боте
    }
  }, [status, finished, onResult, visible]);

  useEffect(() => {
    if (!visible) return;
    if (finished) return;
    if (turn !== 'O') return;

    // ход бота
    const best = minimax(board, true);
    if (best.move === null || best.move === undefined) return;

    const t = setTimeout(() => {
      setBoard((prev) => {
        if (prev[best.move]) return prev;
        const next = prev.slice();
        next[best.move] = 'O';
        return next;
      });
      setTurn('X');
    }, 250);

    return () => clearTimeout(t);
  }, [turn, board, finished, visible]);

  const pressCell = (idx) => {
    if (finished) return;
    if (turn !== 'X') return;
    if (board[idx]) return;

    const next = board.slice();
    next[idx] = 'X';
    setBoard(next);
    setTurn('O');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Мини-игра: Крестики-нолики</Text>
          <Text style={styles.hint}>
            Условие успеха — сыграть в ничью. Ты ходишь первым (X), компьютер (O) играет идеально.
          </Text>

          <View style={styles.grid}>
            {board.map((cell, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.cell, cell && styles.cellFilled]}
                onPress={() => pressCell(i)}
                activeOpacity={0.8}
              >
                <Text style={styles.cellText}>{cell || ''}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onCancel}>
            <Text style={styles.btnTextGhost}>Отмена</Text>
          </TouchableOpacity>
        </View>
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
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  hint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 3 * 86,
    alignSelf: 'center',
    marginBottom: 12,
  },
  cell: {
    width: 86,
    height: 86,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundAlt,
  },
  cellFilled: { backgroundColor: COLORS.background },
  cellText: { fontSize: 34, fontWeight: '800', color: COLORS.textPrimary },
  btn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  btnGhost: { borderWidth: 1, borderColor: COLORS.borderSubtle, backgroundColor: 'transparent' },
  btnTextGhost: { color: COLORS.textPrimary, fontWeight: '700' },
});
