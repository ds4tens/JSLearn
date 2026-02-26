/**
 * Тренировочные данные для заданий по setTimeout / setInterval
 */

// ─── Карты пользователя
const trainingCards = [
  {
    id: "card-001",
    name: "Основная карта",
    masked_card_number: "**** **** **** 1234",
    status: "active",
    balance: "1500.50",
    currency: "USD",
  },
  {
    id: "card-002",
    name: "Рабочая карта",
    masked_card_number: "**** **** **** 5678",
    status: "active",
    balance: "3500.00",
    currency: "EUR",
  },
  {
    id: "card-003",
    name: "Старая карта",
    masked_card_number: "**** **** **** 9012",
    status: "frozen",
    balance: "0.00",
    currency: "USD",
  },
];

// ─── Транзакции
const trainingTransactions = [
  {
    id: "txn-001",
    public_id: 1001,
    created_at: "2024-03-20T10:00:00Z",
    type: "Покупка",
    merchant: "McDonald's",
    amount: "12.50",
    currency: "USD",
    status: "Выполнена",
  },
  {
    id: "txn-002",
    public_id: 1002,
    created_at: "2024-03-20T11:00:00Z",
    type: "Пополнение",
    merchant: "Salary Deposit",
    amount: "2000.00",
    currency: "USD",
    status: "Выполнена",
  },
  {
    id: "txn-003",
    public_id: 1003,
    created_at: "2024-03-20T12:00:00Z",
    type: "Покупка",
    merchant: "Amazon",
    amount: "89.99",
    currency: "USD",
    status: "В обработке",
  },
];

// ─── Уведомления
const trainingNotifications = [
  { type: "success", message: "Карта успешно создана" },
  { type: "error", message: "Недостаточно средств на счёте" },
  { type: "warning", message: "Баланс ниже минимального порога" },
  { type: "info", message: "Новая транзакция" },
];

// ─── Конфигурация таймеров
const timerConfig = {
  AUTO_UPDATE_INTERVAL_MS: 60_000,

  DEBOUNCE_TIMEOUT_MS: 500,

  ERROR_CLEANUP_TTL_MS: 5_000,

  RESEND_COOLDOWN_SECONDS: 60,

  NOTIFICATION_GAP_MS: 500,

  USER_POLL_INTERVAL_MS: 100,
};

export default {
  trainingCards,
  trainingTransactions,
  trainingNotifications,
  timerConfig,
};
