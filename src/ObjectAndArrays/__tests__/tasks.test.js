import { describe, it, expect } from 'vitest';
import {
  getCardName,
  isCardActive,
  getCardBalance,
  getCardTypeName,
  isDailyLimitAllowed,
  getAutoTopupSettings,
  countActiveCards,
  getAllUniqueTags,
  findCardWithMaxBalance,
  getCardsWithoutLimits,
  createSimplifiedCard,
  renameCard,
  addTagToCard,
  updateCardBalance,
  groupCardsByStatus,
  calculateTotalBalance,
  createCardsSummary,
  getUserNotifications,
  isTwoFactorEnabled,
  convertCardsArrayToObject,
  extractCardDisplayFields,
  mergeCardSettings,
  findCardsWithLimitAbove,
  getFavoriteCardsSorted,
  addCardToAccount,
  removeTagFromAllCards,
  updateCardInArray,
} from '../tasks.js';
import trainingData from '../data.js';

const { trainingCards, trainingCardBins, trainingUserProfile, trainingAccount } = trainingData;

describe('УРОВЕНЬ 1: Базовые операции с объектами', () => {
  describe('Задание 1: getCardName', () => {
    it('должна возвращать имя карты', () => {
      const card = trainingCards[0];
      const result = getCardName(card);
      
      // Если тест не прошел, вы увидите:
      // - Ожидаемое значение: "Основная карта"
      // - Полученное значение: "" (или что вы вернули)
      // - Это поможет понять, что вы не извлекли поле name из объекта
      expect(result).toBe('Основная карта');
    });

    it('должна возвращать имя для другой карты', () => {
      const card = trainingCards[1]; // "Рабочая карта"
      const result = getCardName(card);
      
      // Если тест не прошел, вы увидите что ожидалось "Рабочая карта"
      // Это проверяет, что функция работает с разными объектами
      expect(result).toBe('Рабочая карта');
    });

    it('должна возвращать пустую строку для карты без имени', () => {
      const cardWithoutName = { id: '1', balance: '100' };
      const result = getCardName(cardWithoutName);
      
      // Если тест не прошел, значит функция не обработала случай отсутствия поля
      expect(result).toBe('');
    });
  });

  describe('Задание 2: isCardActive', () => {
    it('должна возвращать true для активной карты', () => {
      const activeCard = trainingCards[0]; // status: "Активная"
      const result = isCardActive(activeCard);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: true
      // - Получено: false
      // Это покажет, что условие проверки статуса написано неправильно
      expect(result).toBe(true);
    });

    it('должна возвращать false для замороженной карты', () => {
      const frozenCard = trainingCards[2]; // status: "Замороженная"
      const result = isCardActive(frozenCard);
      expect(result).toBe(false);
    });
  });

  describe('Задание 3: getCardBalance', () => {
    it('должна возвращать баланс карты', () => {
      const card = trainingCards[0]; // balance: "1500.50"
      const result = getCardBalance(card);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: "1500.50"
      // - Получено: "" или undefined
      // Это покажет, что вы не извлекли поле balance или не обработали случай его отсутствия
      expect(result).toBe('1500.50');
    });

    it('должна возвращать баланс для другой карты с большим балансом', () => {
      const card = trainingCards[1]; // balance: "3500.00"
      const result = getCardBalance(card);
      
      // Если тест не прошел, вы увидите что ожидалось "3500.00"
      // Это проверяет работу с разными значениями баланса
      expect(result).toBe('3500.00');
    });

    it('должна возвращать баланс для карты с нулевым балансом', () => {
      const card = trainingCards[2]; // balance: "0.00"
      const result = getCardBalance(card);
      
      // Если тест не прошел, вы увидите что ожидалось "0.00"
      // Это проверяет обработку нулевого баланса
      expect(result).toBe('0.00');
    });

    it('должна возвращать баланс для карты с балансом "0.00"', () => {
      const card = trainingCards[3]; // balance: "0.00"
      const result = getCardBalance(card);
      
      // Если тест не прошел, проверьте что функция возвращает строку "0.00"
      // даже когда баланс равен нулю
      expect(result).toBe('0.00');
    });

    it('должна возвращать "0.00" если баланса нет', () => {
      const cardWithoutBalance = { id: '1', name: 'Test' };
      const result = getCardBalance(cardWithoutBalance);
      
      // Это проверит, что вы правильно обработали случай отсутствия поля
      expect(result).toBe('0.00');
    });
  });
});

describe('УРОВЕНЬ 2: Вложенные объекты', () => {
  describe('Задание 4: getCardTypeName', () => {
    it('должна возвращать название типа карты', () => {
      const card = trainingCards[0];
      const result = getCardTypeName(card);
      
      // Если тест не прошел, вы увидите что ожидалось "Дебетовая", а получили пустую строку
      // Это покажет, что вы не дошли до вложенного объекта type.name
      expect(result).toBe('Дебетовая');
    });
  });

  describe('Задание 5: isDailyLimitAllowed', () => {
    it('должна возвращать true если дневной лимит разрешен', () => {
      const card = trainingCards[0];
      const result = isDailyLimitAllowed(card);
      
      // Если тест не прошел, вы увидите ожидалось true, получено false
      // Это покажет, что проверка поля allowed_daily_limit неправильная
      expect(result).toBe(true);
    });
  });

  describe('Задание 6: getAutoTopupSettings', () => {
    it('должна возвращать настройки автопополнения', () => {
      const card = trainingCards[0];
      const result = getAutoTopupSettings(card);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: объект с top_up_threshold, top_up_amount
      // - Получено: null или undefined
      // Это покажет, что вы не извлекли объект top_up
      expect(result).toEqual({
        top_up_threshold: '100.00',
        top_up_amount: '500.00',
        top_up_is_active: true,
      });
    });

    it('должна возвращать null если настроек нет', () => {
      const cardWithoutTopup = trainingCards[2]; // нет поля top_up
      const result = getAutoTopupSettings(cardWithoutTopup);
      expect(result).toBeNull();
    });
  });
});

describe('УРОВЕНЬ 3: Массивы объектов', () => {
  describe('Задание 7: countActiveCards', () => {
    it('должна считать количество активных карт', () => {
      const result = countActiveCards(trainingCards);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: 2 (в массиве 2 карты со статусом "Активная")
      // - Получено: 0 или другое число
      // Это покажет, что фильтрация по статусу работает неправильно
      expect(result).toBe(2);
    });

    it('должна возвращать 0 для пустого массива', () => {
      const result = countActiveCards([]);
      expect(result).toBe(0);
    });
  });

  describe('Задание 8: getAllUniqueTags', () => {
    it('должна возвращать уникальные теги из всех карт', () => {
      const result = getAllUniqueTags(trainingCards);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: массив с уникальными названиями тегов
      // - Получено: пустой массив или массив с дубликатами
      // Это покажет проблемы в логике сбора и удаления дубликатов
      expect(result).toContain('Еда');
      expect(result).toContain('Транспорт');
      expect(result).toContain('Работа');
      expect(result).toContain('Бизнес');
      expect(result).toContain('Подарочная');
      
      // Проверяем, что нет дубликатов
      const uniqueResult = [...new Set(result)];
      expect(result.length).toBe(uniqueResult.length);
    });
  });

  describe('Задание 9: findCardWithMaxBalance', () => {
    it('должна находить карту с максимальным балансом', () => {
      const result = findCardWithMaxBalance(trainingCards);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: объект карты с id "2" и balance "3500.00"
      // - Получено: null или другая карта
      // Это покажет, что поиск максимума работает неправильно
      expect(result).not.toBeNull();
      expect(result.id).toBe('2');
      expect(result.balance).toBe('3500.00');
    });

    it('должна возвращать null для пустого массива', () => {
      const result = findCardWithMaxBalance([]);
      expect(result).toBeNull();
    });
  });

  describe('Задание 10: getCardsWithoutLimits', () => {
    it('должна возвращать карты без поля limits', () => {
      const result = getCardsWithoutLimits(trainingCards);
      
      // Если тест не прошел, вы увидите разницу между ожидаемым и полученным массивом
      // Это покажет, какие карты должны были быть отфильтрованы, а какие нет
      expect(result.length).toBeGreaterThan(0);
      result.forEach(card => {
        expect(card).not.toHaveProperty('limits');
      });
    });
  });
});

describe('УРОВЕНЬ 4: Трансформация объектов', () => {
  describe('Задание 11: createSimplifiedCard', () => {
    it('должна создавать упрощенную копию карты', () => {
      const card = trainingCards[0];
      const result = createSimplifiedCard(card);
      
      // Если тест не прошел, вы увидите какие поля отсутствуют или неправильны
      expect(result).toEqual({
        id: '1',
        name: 'Основная карта',
        balance: '1500.50',
        currency: 'USD',
      });
    });

    it('не должна изменять оригинальную карту', () => {
      const card = { ...trainingCards[0] };
      const originalKeys = Object.keys(card);
      createSimplifiedCard(card);
      
      // Если тест не прошел, значит оригинальный объект был изменен
      expect(Object.keys(card).length).toBe(originalKeys.length);
    });
  });

  describe('Задание 12: renameCard', () => {
    it('должна создавать новую карту с измененным именем', () => {
      const card = trainingCards[0];
      const newName = 'Новое имя';
      const result = renameCard(card, newName);
      
      // Если тест не прошел, вы увидите что ожидалось и что получилось
      expect(result.name).toBe(newName);
      expect(result).not.toBe(card); // Это должен быть новый объект
    });

    it('не должна изменять оригинальную карту', () => {
      const card = { ...trainingCards[0] };
      const originalName = card.name;
      renameCard(card, 'Новое имя');
      
      // Если тест не прошел, значит вы изменили оригинал
      expect(card.name).toBe(originalName);
    });
  });

  describe('Задание 13: addTagToCard', () => {
    it('должна добавлять тег к карте', () => {
      const card = trainingCards[0];
      const newTag = { id: 10, name: 'Новый тег' };
      const result = addTagToCard(card, newTag);
      
      // Если тест не прошел, вы увидите разницу в массивах тегов
      expect(result.tags).toContainEqual(newTag);
      expect(result.tags.length).toBe(card.tags.length + 1);
    });

    it('не должна изменять оригинальную карту', () => {
      const card = { ...trainingCards[0] };
      const originalTagsLength = card.tags.length;
      addTagToCard(card, { id: 10, name: 'Тест' });
      
      // Если тест не прошел, значит вы мутировали оригинальный массив
      expect(card.tags.length).toBe(originalTagsLength);
    });
  });

  describe('Задание 14: updateCardBalance', () => {
    it('должна обновлять баланс карты', () => {
      const card = trainingCards[0];
      const newBalance = '2000.00';
      const result = updateCardBalance(card, newBalance);
      
      expect(result.balance).toBe(newBalance);
    });

    it('не должна изменять оригинальную карту (deep copy)', () => {
      const card = JSON.parse(JSON.stringify(trainingCards[0]));
      const originalBalance = card.balance;
      const result = updateCardBalance(card, '9999.99');
      
      // Если тест не прошел, значит вы не создали глубокую копию
      expect(card.balance).toBe(originalBalance);
      
      // Проверяем, что вложенные объекты тоже не изменились
      if (card.top_up) {
        expect(result.top_up).not.toBe(card.top_up);
      }
    });
  });
});

describe('УРОВЕНЬ 5: Группировка и агрегация', () => {
  describe('Задание 15: groupCardsByStatus', () => {
    it('должна группировать карты по статусу', () => {
      const result = groupCardsByStatus(trainingCards);
      
      // Если тест не прошел, вы увидите структуру объекта, которая ожидалась
      expect(result).toHaveProperty('Активная');
      expect(result).toHaveProperty('Замороженная');
      expect(result).toHaveProperty('Закрытая');
      
      expect(result['Активная'].length).toBe(2);
      expect(result['Замороженная'].length).toBe(1);
    });
  });

  describe('Задание 16: calculateTotalBalance', () => {
    it('должна подсчитывать общий баланс', () => {
      const result = calculateTotalBalance(trainingCards);
      
      // Если тест не прошел, вы увидите:
      // - Ожидалось: 5000.5 (сумма всех балансов)
      // - Получено: другое число или NaN
      // Это покажет проблемы в преобразовании строк в числа
      expect(result).toBe(5000.5);
    });
  });

  describe('Задание 17: createCardsSummary', () => {
    it('должна создавать сводку по картам', () => {
      const result = createCardsSummary(trainingCards);
      
      // Если тест не прошел, вы увидите какие поля отсутствуют или неправильны
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('total_balance');
      
      expect(result.total).toBe(4);
      expect(result.active).toBe(2);
    });
  });
});

describe('УРОВЕНЬ 6: Глубокие вложенности', () => {
  describe('Задание 18: getUserNotifications', () => {
    it('должна получать настройки уведомлений', () => {
      const result = getUserNotifications(trainingUserProfile);
      
      // Если тест не прошел, вы увидите что ожидался объект с настройками
      expect(result).toEqual({
        email: true,
        sms: false,
        push: true,
      });
    });
  });

  describe('Задание 19: isTwoFactorEnabled', () => {
    it('должна проверять двухфакторную аутентификацию', () => {
      const result = isTwoFactorEnabled(trainingUserProfile);
      
      // Если тест не прошел, вы увидите ожидалось true, получено false
      expect(result).toBe(true);
    });
  });
});

describe('УРОВЕНЬ 7: Преобразование структур данных', () => {
  describe('Задание 20: convertCardsArrayToObject', () => {
    it('должна преобразовывать массив в объект-словарь', () => {
      const cards = [trainingCards[0], trainingCards[1]];
      const result = convertCardsArrayToObject(cards);
      
      // Если тест не прошел, вы увидите структуру объекта
      expect(result).toHaveProperty('1');
      expect(result).toHaveProperty('2');
      expect(result['1']).toEqual(trainingCards[0]);
    });
  });

  describe('Задание 21: extractCardDisplayFields', () => {
    it('должна извлекать нужные поля из карты', () => {
      const card = trainingCards[0];
      const result = extractCardDisplayFields(card);
      
      expect(result).toEqual({
        id: '1',
        name: 'Основная карта',
        masked_card_number: '**** **** **** 1234',
        payment_system: 'Visa',
      });
    });
  });

  describe('Задание 22: mergeCardSettings', () => {
    it('должна объединять настройки карты', () => {
      const base = { limit: 100, currency: 'USD' };
      const override = { limit: 200 };
      const result = mergeCardSettings(base, override);
      
      expect(result).toEqual({
        limit: 200,
        currency: 'USD',
      });
    });
  });
});

describe('УРОВЕНЬ 8: Фильтрация по сложным условиям', () => {
  describe('Задание 23: findCardsWithLimitAbove', () => {
    it('должна находить карты с лимитом выше порога', () => {
      const result = findCardsWithLimitAbove(trainingCards, 'daily', '400');
      
      // Если тест не прошел, вы увидите какие карты должны были быть найдены
      expect(result.length).toBeGreaterThan(0);
      result.forEach(card => {
        expect(parseFloat(card.limits.daily)).toBeGreaterThan(400);
      });
    });
  });

  describe('Задание 24: getFavoriteCardsSorted', () => {
    it('должна возвращать избранные карты отсортированные по балансу', () => {
      const result = getFavoriteCardsSorted(trainingCardBins);
      
      // Если тест не прошел, вы увидите массив ID, который ожидался
      expect(result).toEqual(['bin-3', 'bin-1']);
    });
  });
});

describe('УРОВЕНЬ 9: Работа с массивами в объектах', () => {
  describe('Задание 25: addCardToAccount', () => {
    it('должна добавлять карту в счет', () => {
      const newCard = {
        id: 'card-4',
        masked_number: '**** 9999',
        balance: '999.00',
        currency: 'USD',
      };
      const result = addCardToAccount(trainingAccount, newCard);
      
      expect(result.cards.length).toBe(trainingAccount.cards.length + 1);
      expect(result.cards).toContainEqual(newCard);
    });

    it('не должна изменять оригинальный счет', () => {
      const accountCopy = JSON.parse(JSON.stringify(trainingAccount));
      const originalLength = accountCopy.cards.length;
      addCardToAccount(accountCopy, { id: 'test' });
      
      expect(accountCopy.cards.length).toBe(originalLength);
    });
  });

  describe('Задание 26: removeTagFromAllCards', () => {
    it('должна удалять тег из всех карт', () => {
      const result = removeTagFromAllCards(trainingCards, 1);
      
      result.forEach(card => {
        if (card.tags && card.tags.length > 0) {
          const hasTag = card.tags.some(tag => tag.id === 1);
          expect(hasTag).toBe(false);
        }
      });
    });
  });

  describe('Задание 27: updateCardInArray', () => {
    it('должна обновлять карту в массиве', () => {
      const updates = { name: 'Обновленная карта' };
      const result = updateCardInArray(trainingCards, '1', updates);
      
      const updatedCard = result.find(c => c.id === '1');
      expect(updatedCard.name).toBe('Обновленная карта');
      
      // Оригинальный массив не должен быть изменен
      expect(trainingCards.find(c => c.id === '1').name).not.toBe('Обновленная карта');
    });
  });
});
