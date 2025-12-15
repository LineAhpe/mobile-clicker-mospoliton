/**
 * Модульное тестирование (unit):
 * Проверяем отдельный компонент UpgradeCard в изоляции.
 */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import UpgradeCard from '../components/UpgradeCard';

describe('UpgradeCard (unit)', () => {
  it('кнопка активна при достаточном количестве монет', () => {
    const onPress = jest.fn();
    let tree;

    act(() => {
      tree = renderer.create(
        <UpgradeCard
          title="Тестовое улучшение"
          description="Описание улучшения"
          cost={50}
          bonus={5}
          coins={100}
          onPress={onPress}
        />,
      );
    });

    const root = tree.root;
    const buttons = root.findAllByType(TouchableOpacity);
    const buyButton = buttons[buttons.length - 1];

    expect(buyButton.props.disabled).toBe(false);
    const json = tree.toJSON();
    expect(JSON.stringify(json)).toContain('Прокачать (через мини-игру)');
  });

  it('кнопка отключена при недостаточном количестве монет', () => {
    const onPress = jest.fn();
    let tree;

    act(() => {
      tree = renderer.create(
        <UpgradeCard
          title="Тестовое улучшение"
          description="Описание улучшения"
          cost={100}
          bonus={5}
          coins={10}
          onPress={onPress}
        />,
      );
    });

    const root = tree.root;
    const buttons = root.findAllByType(TouchableOpacity);
    const buyButton = buttons[buttons.length - 1];

    expect(buyButton.props.disabled).toBe(true);
    const json = tree.toJSON();
    expect(JSON.stringify(json)).toContain('Недостаточно монет');
  });
});
