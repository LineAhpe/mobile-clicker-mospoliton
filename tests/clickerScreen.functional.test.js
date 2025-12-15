/**
 * Функциональное тестирование (functional):
 * Сценарий клика по монете на ClickerScreen.
 */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import ClickerScreen from '../screens/ClickerScreen';

describe('ClickerScreen (functional)', () => {
  it('вызывает onCoinClick при нажатии на монету', () => {
    const onCoinClick = jest.fn();

    let component;
    act(() => {
      component = renderer.create(
        <ClickerScreen
          coins={0}
          coinsPerClick={1}
          passiveIncomePerMinute={0}
          onCoinClick={onCoinClick}
        />,
      );
    });

    const root = component.root;
    const coinButton = root.findByType(TouchableOpacity);

    act(() => {
      coinButton.props.onPress();
    });

    expect(onCoinClick).toHaveBeenCalledTimes(1);
  });
});
