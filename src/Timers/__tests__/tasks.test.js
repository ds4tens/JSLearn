import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  scheduleNotification,
  startDataPolling,
  cancelScheduledNotification,
  createCooldownTimer,
  debounce,
  createErrorAutoCleanup,
  throttle,
  createAutoUpdater,
  createDebouncedSearch,
  createNotificationQueue,
  waitForCondition,
  createResendWithCooldown,
  createSmartPoller,
  createErrorDedupQueue,
} from '../tasks.js';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ============================================================
// УРОВЕНЬ 1: Базовые таймеры
// ============================================================

describe('УРОВЕНЬ 1: Базовые таймеры', () => {

  describe('Задание 1: scheduleNotification', () => {
    it('должна вызвать callback с сообщением после задержки', () => {
      const callback = vi.fn();
      scheduleNotification('Карта успешно создана', 500, callback);

      // До истечения задержки — callback ещё не вызван
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);

      // Ровно после 500 мс — вызван с правильным аргументом
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('Карта успешно создана');
    });

    it('не должна вызывать callback до истечения задержки', () => {
      const callback = vi.fn();
      scheduleNotification('Ошибка', 1000, callback);

      vi.advanceTimersByTime(999);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('должна работать с разными сообщениями и задержками', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      scheduleNotification('Сообщение 1', 200, cb1);
      scheduleNotification('Сообщение 2', 800, cb2);

      vi.advanceTimersByTime(200);
      expect(cb1).toHaveBeenCalledWith('Сообщение 1');
      expect(cb2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(600);
      expect(cb2).toHaveBeenCalledWith('Сообщение 2');
    });

    it('должна вернуть timerId (не null и не undefined)', () => {
      const timerId = scheduleNotification('test', 100, vi.fn());
      expect(timerId).not.toBeNull();
      expect(timerId).not.toBeUndefined();
    });

    it('должна вызывать callback ровно один раз (не повторять)', () => {
      const callback = vi.fn();
      scheduleNotification('test', 100, callback);
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Задание 2: startDataPolling', () => {
    it('должна вызывать fetchData каждые intervalMs', () => {
      const fetchData = vi.fn();
      startDataPolling(fetchData, 1000);

      expect(fetchData).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(fetchData).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(fetchData).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(3000);
      expect(fetchData).toHaveBeenCalledTimes(5);
    });

    it('stop() должен остановить автополлинг', () => {
      const fetchData = vi.fn();
      const { stop } = startDataPolling(fetchData, 1000);

      vi.advanceTimersByTime(2000);
      expect(fetchData).toHaveBeenCalledTimes(2);

      stop();

      vi.advanceTimersByTime(5000);
      // После stop() — больше никаких вызовов
      expect(fetchData).toHaveBeenCalledTimes(2);
    });

    it('должна вернуть объект с методом stop', () => {
      const result = startDataPolling(vi.fn(), 1000);
      expect(result).toHaveProperty('stop');
      expect(typeof result.stop).toBe('function');
    });

    it('должна работать с разными интервалами', () => {
      const fetchData = vi.fn();
      startDataPolling(fetchData, 500);

      vi.advanceTimersByTime(2500);
      expect(fetchData).toHaveBeenCalledTimes(5);
    });
  });

  describe('Задание 3: cancelScheduledNotification', () => {
    it('должна отменить callback до его вызова', () => {
      const callback = vi.fn();
      const timerId = scheduleNotification('test', 1000, callback);

      cancelScheduledNotification(timerId);
      vi.advanceTimersByTime(2000);

      expect(callback).not.toHaveBeenCalled();
    });

    it('не должна падать при вызове с невалидным id', () => {
      expect(() => cancelScheduledNotification(99999)).not.toThrow();
      expect(() => cancelScheduledNotification(0)).not.toThrow();
    });

    it('после отмены другие таймеры продолжают работать', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();
      const timerId1 = scheduleNotification('1', 500, cb1);
      scheduleNotification('2', 500, cb2);

      cancelScheduledNotification(timerId1);
      vi.advanceTimersByTime(500);

      expect(cb1).not.toHaveBeenCalled();
      expect(cb2).toHaveBeenCalledTimes(1);
    });
  });
});

// ============================================================
// УРОВЕНЬ 2: Управление таймерами
// ============================================================

describe('УРОВЕНЬ 2: Управление таймерами', () => {

  describe('Задание 4: createCooldownTimer', () => {
    it('должен вызывать onTick каждую секунду с убывающим значением', () => {
      const onTick = vi.fn();
      const onFinish = vi.fn();
      const timer = createCooldownTimer(3, onTick, onFinish);
      timer.start();

      vi.advanceTimersByTime(1000);
      expect(onTick).toHaveBeenCalledWith(2);

      vi.advanceTimersByTime(1000);
      expect(onTick).toHaveBeenCalledWith(1);

      vi.advanceTimersByTime(1000);
      expect(onTick).toHaveBeenCalledWith(0);
    });

    it('должен вызвать onFinish когда счётчик достиг 0', () => {
      const onFinish = vi.fn();
      const timer = createCooldownTimer(3, vi.fn(), onFinish);
      timer.start();

      expect(onFinish).not.toHaveBeenCalled();
      vi.advanceTimersByTime(3000);
      expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('не должен продолжать тикать после onFinish', () => {
      const onTick = vi.fn();
      const onFinish = vi.fn();
      const timer = createCooldownTimer(2, onTick, onFinish);
      timer.start();

      vi.advanceTimersByTime(5000);
      // onTick вызван ровно 2 раза (при remaining = 1 и remaining = 0)
      expect(onTick).toHaveBeenCalledTimes(2);
      expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('stop() должен остановить таймер до завершения', () => {
      const onTick = vi.fn();
      const onFinish = vi.fn();
      const timer = createCooldownTimer(10, onTick, onFinish);
      timer.start();

      vi.advanceTimersByTime(3000);
      timer.stop();
      vi.advanceTimersByTime(10000);

      expect(onTick).toHaveBeenCalledTimes(3);
      expect(onFinish).not.toHaveBeenCalled();
    });

    it('повторный start() должен сбрасывать счётчик', () => {
      const onTick = vi.fn();
      const timer = createCooldownTimer(5, onTick, vi.fn());
      timer.start();

      vi.advanceTimersByTime(2000); // тик до 3
      timer.stop();
      timer.start(); // перезапуск с 5

      vi.advanceTimersByTime(1000);
      // Последний вызов должен быть с 4 (5 - 1), не с 2 (3 - 1)
      const lastCall = onTick.mock.calls[onTick.mock.calls.length - 1][0];
      expect(lastCall).toBe(4);
    });
  });

  describe('Задание 5: debounce', () => {
    it('должна вызвать функцию один раз после нескольких быстрых вызовов', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('a');
      debouncedFn('b');
      debouncedFn('c');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('должна вызвать функцию с аргументами последнего вызова', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('первый');
      debouncedFn('второй');
      debouncedFn('третий');

      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledWith('третий');
    });

    it('каждый вызов сбрасывает таймер', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn();
      vi.advanceTimersByTime(200); // прошло 200 из 300
      debouncedFn(); // сброс таймера
      vi.advanceTimersByTime(200); // прошло 200 из нового 300

      expect(fn).not.toHaveBeenCalled(); // ещё не 300 мс от последнего вызова

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('если вызовы разделены паузами > delay — каждый срабатывает отдельно', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('первый');
      vi.advanceTimersByTime(400);
      debouncedFn('второй');
      vi.advanceTimersByTime(400);

      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(1, 'первый');
      expect(fn).toHaveBeenNthCalledWith(2, 'второй');
    });

    it('должна корректно работать с несколькими аргументами', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn('a', 'b', 'c');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
    });
  });

  describe('Задание 6: createErrorAutoCleanup', () => {
    it('должна удалить ошибку из очереди через ttl', () => {
      const queue = { 'Сервер недоступен': Date.now() };
      createErrorAutoCleanup('Сервер недоступен', queue, 5000);

      expect(queue['Сервер недоступен']).toBeDefined();

      vi.advanceTimersByTime(5000);

      expect(queue['Сервер недоступен']).toBeUndefined();
    });

    it('не должна удалять ошибку до истечения ttl', () => {
      const queue = { 'Недостаточно средств': 100 };
      createErrorAutoCleanup('Недостаточно средств', queue, 3000);

      vi.advanceTimersByTime(2999);
      expect(queue['Недостаточно средств']).toBeDefined();
    });

    it('должна удалять только указанную ошибку, не трогая другие', () => {
      const queue = {
        'Ошибка 1': 100,
        'Ошибка 2': 200,
      };
      createErrorAutoCleanup('Ошибка 1', queue, 1000);

      vi.advanceTimersByTime(1000);

      expect(queue['Ошибка 1']).toBeUndefined();
      expect(queue['Ошибка 2']).toBe(200);
    });

    it('должна вернуть timerId (не null и не undefined)', () => {
      const timerId = createErrorAutoCleanup('test', {}, 1000);
      expect(timerId).not.toBeNull();
      expect(timerId).not.toBeUndefined();
    });
  });

  describe('Задание 7: throttle', () => {
    it('должна выполнить первый вызов немедленно', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('должна игнорировать повторные вызовы в течение interval', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('должна допустить следующий вызов после истечения interval', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn(); // выполняется
      vi.advanceTimersByTime(1000);
      throttledFn(); // выполняется снова

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('должна передавать аргументы в оригинальную функцию', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 500);

      throttledFn('карта', 123);
      expect(fn).toHaveBeenCalledWith('карта', 123);
    });

    it('не должна пропускать вызов в промежутке между интервалами', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 1000);

      throttledFn(); // t=0 → выполняется
      vi.advanceTimersByTime(400);
      throttledFn(); // t=400 → игнорируется
      vi.advanceTimersByTime(400);
      throttledFn(); // t=800 → игнорируется
      vi.advanceTimersByTime(200);
      throttledFn(); // t=1000 → выполняется

      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});

// ============================================================
// УРОВЕНЬ 3: Продвинутые паттерны
// ============================================================

describe('УРОВЕНЬ 3: Продвинутые паттерны', () => {

  describe('Задание 8: createAutoUpdater', () => {
    it('start() должен вызвать loadData сразу же', () => {
      const loadData = vi.fn().mockResolvedValue(undefined);
      const updater = createAutoUpdater(loadData, 60000);
      updater.start();

      expect(loadData).toHaveBeenCalledTimes(1);
    });

    it('должен повторять loadData с заданным интервалом', () => {
      const loadData = vi.fn().mockResolvedValue(undefined);
      const updater = createAutoUpdater(loadData, 1000);
      updater.start();

      // Первый вызов сразу
      expect(loadData).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(loadData).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(2000);
      expect(loadData).toHaveBeenCalledTimes(4);
    });

    it('stop() должен прекратить обновления', () => {
      const loadData = vi.fn().mockResolvedValue(undefined);
      const updater = createAutoUpdater(loadData, 1000);
      updater.start();

      vi.advanceTimersByTime(2000);
      expect(loadData).toHaveBeenCalledTimes(3);

      updater.stop();
      vi.advanceTimersByTime(5000);
      expect(loadData).toHaveBeenCalledTimes(3);
    });

    it('повторный start() не должен создавать несколько интервалов', () => {
      const loadData = vi.fn().mockResolvedValue(undefined);
      const updater = createAutoUpdater(loadData, 1000);

      updater.start();
      updater.start();
      updater.start();

      vi.advanceTimersByTime(2000);
      // Если было бы 3 интервала — вызовов было бы 3*2+3=9, а должно быть 3
      expect(loadData).toHaveBeenCalledTimes(3);
    });

    it('после stop() можно снова запустить через start()', () => {
      const loadData = vi.fn().mockResolvedValue(undefined);
      const updater = createAutoUpdater(loadData, 1000);

      updater.start();
      vi.advanceTimersByTime(1000);
      updater.stop();

      updater.start(); // перезапуск
      vi.advanceTimersByTime(1000);

      expect(loadData).toHaveBeenCalledTimes(4); // 2 до стопа + 2 после
    });
  });

  describe('Задание 9: createDebouncedSearch', () => {
    it('search() должен дебаунсить вызовы searchFn', () => {
      const searchFn = vi.fn();
      const { search } = createDebouncedSearch(searchFn, 300);

      search({ name: 'карта' });
      search({ name: 'карта 2' });
      search({ name: 'карта 3' });

      expect(searchFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      expect(searchFn).toHaveBeenCalledTimes(1);
      expect(searchFn).toHaveBeenCalledWith({ name: 'карта 3' });
    });

    it('cancel() должен отменить ожидающий вызов', () => {
      const searchFn = vi.fn();
      const { search, cancel } = createDebouncedSearch(searchFn, 300);

      search({ name: 'тест' });
      cancel();
      vi.advanceTimersByTime(300);

      expect(searchFn).not.toHaveBeenCalled();
    });

    it('после cancel() следующий search() должен работать нормально', () => {
      const searchFn = vi.fn();
      const { search, cancel } = createDebouncedSearch(searchFn, 300);

      search({ name: 'первый' });
      cancel();

      search({ name: 'второй' });
      vi.advanceTimersByTime(300);

      expect(searchFn).toHaveBeenCalledTimes(1);
      expect(searchFn).toHaveBeenCalledWith({ name: 'второй' });
    });

    it('повторный cancel() не должен вызывать ошибок', () => {
      const { cancel } = createDebouncedSearch(vi.fn(), 300);
      expect(() => {
        cancel();
        cancel();
      }).not.toThrow();
    });
  });

  describe('Задание 10: createNotificationQueue', () => {
    it('первое уведомление должно показаться сразу', () => {
      const displayFn = vi.fn();
      const queue = createNotificationQueue(displayFn, 500);

      queue.push({ type: 'success', message: 'Карта создана' });

      expect(displayFn).toHaveBeenCalledTimes(1);
      expect(displayFn).toHaveBeenCalledWith({ type: 'success', message: 'Карта создана' });
    });

    it('второе уведомление должно показаться после gapMs', () => {
      const displayFn = vi.fn();
      const queue = createNotificationQueue(displayFn, 500);

      queue.push({ type: 'success', message: 'Первое' });
      queue.push({ type: 'error', message: 'Второе' });

      expect(displayFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(500);

      expect(displayFn).toHaveBeenCalledTimes(2);
      expect(displayFn).toHaveBeenNthCalledWith(2, { type: 'error', message: 'Второе' });
    });

    it('должен показывать уведомления в порядке добавления', () => {
      const displayFn = vi.fn();
      const queue = createNotificationQueue(displayFn, 500);

      queue.push({ type: 'info', message: 'Первое' });
      queue.push({ type: 'error', message: 'Второе' });
      queue.push({ type: 'success', message: 'Третье' });

      vi.advanceTimersByTime(1000);

      expect(displayFn).toHaveBeenNthCalledWith(1, { type: 'info', message: 'Первое' });
      expect(displayFn).toHaveBeenNthCalledWith(2, { type: 'error', message: 'Второе' });
      expect(displayFn).toHaveBeenNthCalledWith(3, { type: 'success', message: 'Третье' });
    });

    it('не должен показывать два уведомления одновременно', () => {
      const displayFn = vi.fn();
      const queue = createNotificationQueue(displayFn, 1000);

      queue.push({ type: 'info', message: '1' });
      queue.push({ type: 'info', message: '2' });

      vi.advanceTimersByTime(500); // половина gap
      expect(displayFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(500); // полный gap
      expect(displayFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Задание 11: waitForCondition', () => {
    it('должна вернуть true когда условие выполнилось', async () => {
      let flag = false;
      setTimeout(() => { flag = true; }, 300);

      const promise = waitForCondition(() => flag, 100, 1000);
      await vi.advanceTimersByTimeAsync(400);

      const result = await promise;
      expect(result).toBe(true);
    });

    it('должна вернуть false если условие не выполнилось до таймаута', async () => {
      const promise = waitForCondition(() => false, 100, 500);
      await vi.advanceTimersByTimeAsync(600);

      const result = await promise;
      expect(result).toBe(false);
    });

    it('должна вернуть true сразу если условие уже выполнено', async () => {
      const promise = waitForCondition(() => true, 100, 1000);
      await vi.advanceTimersByTimeAsync(100);

      const result = await promise;
      expect(result).toBe(true);
    });

    it('должна проверять условие с заданным интервалом', async () => {
      const conditionFn = vi.fn().mockReturnValue(false);
      const promise = waitForCondition(conditionFn, 200, 1000);

      await vi.advanceTimersByTimeAsync(400);
      // За 400 мс с интервалом 200 мс должно быть 2 проверки
      expect(conditionFn.mock.calls.length).toBeGreaterThanOrEqual(2);

      await vi.advanceTimersByTimeAsync(700);
      await promise;
    });
  });
});

// ============================================================
// УРОВЕНЬ 4: Сложные сценарии
// ============================================================

describe('УРОВЕНЬ 4: Сложные сценарии', () => {

  describe('Задание 12: createResendWithCooldown', () => {
    it('send() должна вызвать sendFn', async () => {
      const sendFn = vi.fn().mockResolvedValue(undefined);
      const { send } = createResendWithCooldown(sendFn, 3);

      await send();

      expect(sendFn).toHaveBeenCalledTimes(1);
    });

    it('после успешной отправки должен запуститься кулдаун', async () => {
      const sendFn = vi.fn().mockResolvedValue(undefined);
      const { send, getCooldown } = createResendWithCooldown(sendFn, 5);

      await send();

      expect(getCooldown()).toBe(5);
    });

    it('getCooldown() должен уменьшаться каждую секунду', async () => {
      const sendFn = vi.fn().mockResolvedValue(undefined);
      const { send, getCooldown } = createResendWithCooldown(sendFn, 3);

      await send();

      vi.advanceTimersByTime(1000);
      expect(getCooldown()).toBe(2);

      vi.advanceTimersByTime(1000);
      expect(getCooldown()).toBe(1);

      vi.advanceTimersByTime(1000);
      expect(getCooldown()).toBe(0);
    });

    it('isDisabled() должна быть true во время кулдауна', async () => {
      const sendFn = vi.fn().mockResolvedValue(undefined);
      const { send, isDisabled } = createResendWithCooldown(sendFn, 3);

      expect(isDisabled()).toBe(false);

      await send();
      expect(isDisabled()).toBe(true);

      vi.advanceTimersByTime(3000);
      expect(isDisabled()).toBe(false);
    });

    it('send() должна игнорироваться во время кулдауна', async () => {
      const sendFn = vi.fn().mockResolvedValue(undefined);
      const { send } = createResendWithCooldown(sendFn, 10);

      await send();

      // Попытки отправить снова во время кулдауна
      await send();
      await send();

      expect(sendFn).toHaveBeenCalledTimes(1);
    });

    it('после окончания кулдауна send() должна работать снова', async () => {
      const sendFn = vi.fn().mockResolvedValue(undefined);
      const { send } = createResendWithCooldown(sendFn, 2);

      await send();
      vi.advanceTimersByTime(2000);
      await send();

      expect(sendFn).toHaveBeenCalledTimes(2);
    });

    it('isDisabled() должна быть true пока идёт запрос (isPending)', async () => {
      let resolvePromise;
      const sendFn = vi.fn().mockImplementation(
        () => new Promise((resolve) => { resolvePromise = resolve; })
      );
      const { send, isDisabled } = createResendWithCooldown(sendFn, 3);

      const sendPromise = send();
      expect(isDisabled()).toBe(true);

      resolvePromise();
      await sendPromise;
    });
  });

  describe('Задание 13: createSmartPoller', () => {
    it('start() должен сразу сделать первый запрос', async () => {
      const fetchFn = vi.fn().mockResolvedValue('данные');
      const onSuccess = vi.fn();
      const poller = createSmartPoller(fetchFn, {
        normalInterval: 1000,
        errorInterval: 5000,
        onSuccess,
        onError: vi.fn(),
      });

      poller.start();
      await vi.advanceTimersByTimeAsync(0);

      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('данные');
    });

    it('после успеха должен повторить запрос через normalInterval', async () => {
      const fetchFn = vi.fn().mockResolvedValue('ok');
      const onSuccess = vi.fn();
      const poller = createSmartPoller(fetchFn, {
        normalInterval: 1000,
        errorInterval: 5000,
        onSuccess,
        onError: vi.fn(),
      });

      poller.start();
      await vi.advanceTimersByTimeAsync(1000);

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('после ошибки должен повторить через errorInterval, а не normalInterval', async () => {
      const error = new Error('Сеть недоступна');
      const fetchFn = vi.fn().mockRejectedValueOnce(error).mockResolvedValue('ok');
      const onError = vi.fn();
      const onSuccess = vi.fn();
      const poller = createSmartPoller(fetchFn, {
        normalInterval: 1000,
        errorInterval: 5000,
        onSuccess,
        onError,
      });

      poller.start();
      await vi.advanceTimersByTimeAsync(0);

      expect(onError).toHaveBeenCalledWith(error);

      // Через normalInterval (1000) — нет запроса
      await vi.advanceTimersByTimeAsync(1000);
      expect(fetchFn).toHaveBeenCalledTimes(1);

      // Через errorInterval (5000) — есть запрос
      await vi.advanceTimersByTimeAsync(4000);
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('stop() должен остановить поллинг', async () => {
      const fetchFn = vi.fn().mockResolvedValue('ok');
      const poller = createSmartPoller(fetchFn, {
        normalInterval: 1000,
        errorInterval: 5000,
        onSuccess: vi.fn(),
        onError: vi.fn(),
      });

      poller.start();
      await vi.advanceTimersByTimeAsync(0);
      poller.stop();

      await vi.advanceTimersByTimeAsync(5000);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Задание 14: createErrorDedupQueue', () => {
    it('должна показать ошибку при первом add()', () => {
      const notifyFn = vi.fn();
      const { add } = createErrorDedupQueue(notifyFn, 5000);

      add('Сервер недоступен');

      expect(notifyFn).toHaveBeenCalledTimes(1);
      expect(notifyFn).toHaveBeenCalledWith('Сервер недоступен');
    });

    it('не должна повторять одинаковую ошибку в течение ttl', () => {
      const notifyFn = vi.fn();
      const { add } = createErrorDedupQueue(notifyFn, 5000);

      add('Ошибка авторизации');
      add('Ошибка авторизации');
      add('Ошибка авторизации');

      expect(notifyFn).toHaveBeenCalledTimes(1);
    });

    it('разные сообщения показываются независимо', () => {
      const notifyFn = vi.fn();
      const { add } = createErrorDedupQueue(notifyFn, 5000);

      add('Ошибка 1');
      add('Ошибка 2');
      add('Ошибка 1'); // дубликат

      expect(notifyFn).toHaveBeenCalledTimes(2);
      expect(notifyFn).toHaveBeenCalledWith('Ошибка 1');
      expect(notifyFn).toHaveBeenCalledWith('Ошибка 2');
    });

    it('после истечения ttl та же ошибка должна показаться снова', () => {
      const notifyFn = vi.fn();
      const { add } = createErrorDedupQueue(notifyFn, 3000);

      add('Нет соединения');
      expect(notifyFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(3000); // ttl истёк

      add('Нет соединения'); // должна показаться снова
      expect(notifyFn).toHaveBeenCalledTimes(2);
    });

    it('до истечения ttl повторная ошибка не показывается', () => {
      const notifyFn = vi.fn();
      const { add } = createErrorDedupQueue(notifyFn, 5000);

      add('Нет соединения');
      vi.advanceTimersByTime(4999); // ttl ещё не истёк
      add('Нет соединения');

      expect(notifyFn).toHaveBeenCalledTimes(1);
    });

    it('должна корректно работать с множеством разных ошибок', () => {
      const notifyFn = vi.fn();
      const { add } = createErrorDedupQueue(notifyFn, 2000);

      const errors = [
        'Ошибка сети',
        'Ошибка авторизации',
        'Сервер недоступен',
        'Ошибка сети', // дубликат
        'Ошибка авторизации', // дубликат
      ];

      errors.forEach((e) => add(e));

      expect(notifyFn).toHaveBeenCalledTimes(3);
    });
  });
});
