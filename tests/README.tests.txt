Тесты для приложения кликера (Jest + react-test-renderer)
=========================================================

В папке tests добавлены примеры трёх типов тестирования:

1. Модульное (unit)
   - upgradeCard.unit.test.js — отдельно тестируется компонент UpgradeCard:
     проверяется текст и состояние кнопки при достаточном/недостаточном балансе монет.

2. Интеграционное (integration)
   - upgradeScreen.integration.test.js — проверяется взаимодействие UpgradeScreen и UpgradeCard:
     вычисленные значения cost/bonus корректно передаются в дочерний компонент,
     а нажатие по карточке вызывает onRequestUpgrade.

3. Функциональное (functional)
   - clickerScreen.functional.test.js — моделируется поведение пользователя:
     нажатие на монету на ClickerScreen приводит к вызову обработчика onCoinClick.

Для запуска тестов можно установить jest и react-test-renderer и добавить в package.json скрипт:

  "scripts": {
    "test": "jest"
  }

и затем выполнить: npm test
