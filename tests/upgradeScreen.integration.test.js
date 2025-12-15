/**
 * Интеграционное тестирование (integration):
 * UpgradeScreen + UpgradeCard.
 */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import UpgradeScreen from '../screens/UpgradeScreen';
import UpgradeCard from '../components/UpgradeCard';

describe('UpgradeScreen + UpgradeCard (integration)', () => {
  it('передаёт вычисленные cost и bonus в первую карточку UpgradeCard', () => {
    const onRequestUpgrade = jest.fn();
    const coinsPerClick = 10;

    let component;
    act(() => {
      component = renderer.create(
        <UpgradeScreen
          coins={0}
          coinsPerClick={coinsPerClick}
          passiveIncomePerMinute={0}
          onRequestUpgrade={onRequestUpgrade}
        />,
      );
    });

    const root = component.root;
    const cards = root.findAllByType(UpgradeCard);
    expect(cards.length).toBeGreaterThan(0);

    const firstCard = cards[0];
    const expectedCost = Math.max(10, coinsPerClick * 5);
    const expectedBonus = Math.max(1, Math.round(coinsPerClick * 0.5));

    expect(firstCard.props.cost).toBe(expectedCost);
    expect(firstCard.props.bonus).toBe(expectedBonus);
  });

  it('вызывает onRequestUpgrade при нажатии на UpgradeCard', () => {
    const onRequestUpgrade = jest.fn();

    let component;
    act(() => {
      component = renderer.create(
        <UpgradeScreen
          coins={200}
          coinsPerClick={10}
          passiveIncomePerMinute={0}
          onRequestUpgrade={onRequestUpgrade}
        />,
      );
    });

    const root = component.root;
    const cards = root.findAllByType(UpgradeCard);
    const firstCard = cards[0];

    act(() => {
      firstCard.props.onPress();
    });

    expect(onRequestUpgrade).toHaveBeenCalledTimes(1);
    expect(onRequestUpgrade).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        title: expect.any(String),
        cost: firstCard.props.cost,
        bonus: firstCard.props.bonus,
      }),
    );
  });
});
