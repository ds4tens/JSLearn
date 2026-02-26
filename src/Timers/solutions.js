/**
 * РЕШЕНИЯ заданий по setTimeout / setInterval
 *
 * Не подглядывай, пока не попробовала сама! :)
 */

// ============================================================
// УРОВЕНЬ 1: Базовые таймеры
// ============================================================

/**
 * Задание 1: Отложенное уведомление
 */
function scheduleNotification(message, delay, callback) {
  return setTimeout(() => {
    callback(message);
  }, delay);
}

/**
 * Задание 2: Автополлинг данных
 */
function startDataPolling(fetchData, intervalMs) {
  const timerId = setInterval(() => {
    fetchData();
  }, intervalMs);

  return {
    stop: () => {
      clearInterval(timerId);
    },
  };
}

/**
 * Задание 3: Отмена отложенного уведомления
 */
function cancelScheduledNotification(timerId) {
  clearTimeout(timerId);
}

// ============================================================
// УРОВЕНЬ 2: Управление таймерами
// ============================================================

/**
 * Задание 4: Таймер обратного отсчёта
 */
function createCooldownTimer(totalSeconds, onTick, onFinish) {
  let timerId = null;
  let remaining = totalSeconds;

  return {
    start() {
      remaining = totalSeconds;
      timerId = setInterval(() => {
        remaining -= 1;
        onTick(remaining);
        if (remaining === 0) {
          clearInterval(timerId);
          timerId = null;
          onFinish();
        }
      }, 1000);
    },
    stop() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Задание 5: Debounce для поля поиска
 */
function debounce(fn, delay) {
  let timerId = null;

  return function (...args) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

/**
 * Задание 6: Автоочистка ошибки из очереди
 */
function createErrorAutoCleanup(errorMessage, queue, ttl) {
  const timerId = setTimeout(() => {
    delete queue[errorMessage];
  }, ttl);
  return timerId;
}

/**
 * Задание 7: Throttle для обработчика прокрутки
 */
function throttle(fn, interval) {
  let lastCallTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      fn(...args);
    }
  };
}

// ============================================================
// УРОВЕНЬ 3: Продвинутые паттерны
// ============================================================

/**
 * Задание 8: Автообновление с немедленным первым запросом
 *
 * Ключевые моменты:
 * - защита от двойного запуска (if timerId !== null → return)
 * - loadData вызывается ДО запуска setInterval
 */
function createAutoUpdater(loadData, intervalMs) {
  let timerId = null;

  return {
    start() {
      if (timerId !== null) return; // защита от двойного запуска
      loadData();
      timerId = setInterval(() => {
        loadData();
      }, intervalMs);
    },
    stop() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Задание 9: Отменяемый debounced поиск
 *
 * Ключевое отличие от обычного debounce:
 * cancel() явно обнуляет timerId, что позволяет
 * компоненту "убрать за собой" при размонтировании.
 */
function createDebouncedSearch(searchFn, delay) {
  let timerId = null;

  return {
    search(params) {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        searchFn(params);
        timerId = null;
      }, delay);
    },
    cancel() {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Задание 10: Очередь уведомлений с задержкой
 *
 * Ключевой паттерн: флаг isShowing предотвращает одновременный
 * показ нескольких уведомлений. showNext вызывает себя рекурсивно.
 */
function createNotificationQueue(displayFn, gapMs) {
  const queue = [];
  let isShowing = false;

  function showNext() {
    if (isShowing || queue.length === 0) return;
    isShowing = true;
    const next = queue.shift();
    displayFn(next);
    setTimeout(() => {
      isShowing = false;
      showNext();
    }, gapMs);
  }

  return {
    push(notification) {
      queue.push(notification);
      showNext();
    },
  };
}

/**
 * Задание 11: Ожидание условия с таймаутом
 *
 * Паттерн: setInterval внутри Promise.
 * Два условия выхода: условие выполнилось ИЛИ прошло слишком много времени.
 */
function waitForCondition(conditionFn, intervalMs, timeoutMs) {
  return new Promise((resolve) => {
    let elapsed = 0;

    const intervalId = setInterval(() => {
      elapsed += intervalMs;

      if (conditionFn()) {
        clearInterval(intervalId);
        resolve(true);
        return;
      }

      if (elapsed >= timeoutMs) {
        clearInterval(intervalId);
        resolve(false);
      }
    }, intervalMs);
  });
}

// ============================================================
// УРОВЕНЬ 4: Сложные сценарии
// ============================================================

/**
 * Задание 12: Кнопка повторной отправки с кулдауном
 *
 * Ключевые моменты:
 * - isPending предотвращает двойную отправку
 * - cooldown > 0 предотвращает отправку во время обратного отсчёта
 * - finally гарантирует сброс isPending даже при ошибке sendFn
 */
function createResendWithCooldown(sendFn, cooldownSec) {
  let cooldown = 0;
  let isPending = false;
  let intervalId = null;

  return {
    async send() {
      if (isPending || cooldown > 0) return;

      isPending = true;
      try {
        await sendFn();
        cooldown = cooldownSec;
        intervalId = setInterval(() => {
          cooldown -= 1;
          if (cooldown === 0) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }, 1000);
      } finally {
        isPending = false;
      }
    },
    getCooldown() {
      return cooldown;
    },
    isDisabled() {
      return isPending || cooldown > 0;
    },
  };
}

/**
 * Задание 13: Умный поллинг с разными интервалами
 *
 * Ключевой паттерн: setTimeout (не setInterval!), потому что следующий
 * запрос планируется только ПОСЛЕ завершения текущего, с разным интервалом
 * в зависимости от результата.
 */
function createSmartPoller(fetchFn, { normalInterval, errorInterval, onSuccess, onError }) {
  let timerId = null;
  let stopped = false;

  async function runOnce() {
    try {
      const data = await fetchFn();
      onSuccess(data);
      if (!stopped) {
        timerId = setTimeout(runOnce, normalInterval);
      }
    } catch (err) {
      onError(err);
      if (!stopped) {
        timerId = setTimeout(runOnce, errorInterval);
      }
    }
  }

  return {
    start() {
      stopped = false;
      runOnce();
    },
    stop() {
      stopped = true;
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    },
  };
}

/**
 * Задание 14: Дедупликация ошибок с TTL
 *
 * Ключевой паттерн: объект queue работает как Set с автоочисткой.
 * Каждый timerId хранится в queue[message], что позволяет при необходимости
 * отменить его вручную.
 */
function createErrorDedupQueue(notifyFn, ttl) {
  const queue = {};

  return {
    add(message) {
      if (queue[message]) return;

      notifyFn(message);
      queue[message] = setTimeout(() => {
        delete queue[message];
      }, ttl);
    },
  };
}

export {
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
};
