/**
 * Тренировочные данные для практических заданий по работе с объектами
 */

// 1. Данные карт для тренировки
const trainingCards = [
  {
    id: "1",
    masked_card_number: "**** **** **** 1234",
    name: "Основная карта",
    created_at: "2024-01-15",
    payment_system: "Visa",
    tags: [
      { id: 1, name: "Еда" },
      { id: 2, name: "Транспорт" },
    ],
    status: "Активная",
    balance: "1500.50",
    spending: "234.99",
    currency: "USD",
    limits: {
      daily: "500.00",
      weekly: null,
      monthly: "2000.00",
    },
    type: {
      id: 1,
      name: "Дебетовая",
      allowed_daily_limit: true,
      allowed_weekly_limit: true,
      allowed_monthly_limit: true,
    },
    top_up: {
      top_up_threshold: "100.00",
      top_up_amount: "500.00",
      top_up_is_active: true,
    },
  },
  {
    id: "2",
    masked_card_number: "**** **** **** 5678",
    name: "Рабочая карта",
    created_at: "2024-02-20",
    payment_system: "Master Card",
    tags: [
      { id: 3, name: "Работа" },
      { id: 4, name: "Бизнес" },
    ],
    status: "Активная",
    balance: "3500.00",
    spending: "1200.00",
    currency: "EUR",
    limits: {
      daily: "1000.00",
      weekly: "5000.00",
      monthly: null,
    },
    type: {
      id: 2,
      name: "Кредитная",
      allowed_daily_limit: true,
      allowed_weekly_limit: true,
      allowed_monthly_limit: false,
    },
  },
  {
    id: "3",
    masked_card_number: "**** **** **** 9012",
    name: "Старая карта",
    created_at: "2023-06-10",
    payment_system: "Visa",
    tags: [],
    status: "Замороженная",
    balance: "0.00",
    spending: "0.00",
    currency: "USD",
    type: {
      id: 1,
      name: "Дебетовая",
      allowed_daily_limit: true,
      allowed_weekly_limit: true,
      allowed_monthly_limit: true,
    },
  },
  {
    id: "4",
    masked_card_number: "**** **** **** 3456",
    name: "Подарочная карта",
    created_at: "2024-03-05",
    payment_system: "Master Card",
    tags: [{ id: 5, name: "Подарочная" }],
    status: "Закрытая",
    balance: "0.00",
    spending: "50.00",
    currency: "EUR",
    limits: {
      daily: "50.00",
      weekly: null,
      monthly: null,
    },
    type: {
      id: 3,
      name: "Подарочная",
      allowed_daily_limit: true,
      allowed_weekly_limit: false,
      allowed_monthly_limit: false,
    },
  },
];

// 2. Данные банковских продуктов (bin)
const trainingCardBins = [
  {
    id: "bin-1",
    bin: "411111",
    currency: "USD",
    is_favorite: true,
    country: "США",
    max_quantity_per_user: 3,
    issue_cost: { amount: "5.00", currency: "USD" },
    service_fee: { amount: "2.50", currency: "USD" },
    rates: {
      exchange_fee: "2.5%",
      first_replenishment_fee: "1.0%",
      international_transaction_fee: "3.0%",
      replenishment_fee: "0.5%",
    },
    tags: ["Туризм", "Онлайн-покупки"],
    payment_system: "Visa",
    is_active: true,
  },
  {
    id: "bin-2",
    bin: "555555",
    currency: "EUR",
    is_favorite: false,
    country: "Германия",
    max_quantity_per_user: 5,
    issue_cost: { amount: "3.00", currency: "EUR" },
    service_fee: { amount: "1.50", currency: "EUR" },
    rates: {
      exchange_fee: "1.8%",
      first_replenishment_fee: "0.5%",
      international_transaction_fee: "2.5%",
      replenishment_fee: "0.3%",
    },
    tags: ["Бизнес", "Премиум"],
    payment_system: "Master Card",
    is_active: true,
  },
  {
    id: "bin-3",
    bin: "622222",
    currency: "USD",
    is_favorite: true,
    country: "Великобритания",
    max_quantity_per_user: 1,
    issue_cost: { amount: "10.00", currency: "USD" },
    service_fee: { amount: "0.00", currency: "USD" },
    rates: {
      exchange_fee: "0.0%",
      first_replenishment_fee: "0.0%",
      international_transaction_fee: "1.5%",
      replenishment_fee: "0.0%",
    },
    tags: ["VIP", "Премиум", "Туризм"],
    payment_system: "Visa",
    is_active: false,
  },
];

// 3. Данные транзакций
const trainingTransactions = [
  {
    id: "txn-1",
    amount: "50.00",
    currency: "USD",
    merchant: "McDonald's",
    category: "Еда",
    date: "2024-03-20",
    status: "completed",
  },
  {
    id: "txn-2",
    amount: "12.50",
    currency: "USD",
    merchant: "Uber",
    category: "Транспорт",
    date: "2024-03-19",
    status: "completed",
  },
  {
    id: "txn-3",
    amount: "234.99",
    currency: "EUR",
    merchant: "Amazon",
    category: "Покупки",
    date: "2024-03-18",
    status: "pending",
  },
  {
    id: "txn-4",
    amount: "1000.00",
    currency: "USD",
    merchant: "Salary Deposit",
    category: "Доход",
    date: "2024-03-15",
    status: "completed",
  },
];

// 4. Объекты с вложенной структурой
const trainingUserProfile = {
  id: "user-123",
  name: "Анна Петрова",
  email: "anna@example.com",
  created_at: "2023-01-10",
  settings: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    security: {
      two_factor_enabled: true,
      biometric_enabled: false,
    },
    preferences: {
      language: "ru",
      currency: "USD",
      theme: "light",
    },
  },
  account: {
    balance: "5000.00",
    currency: "USD",
    cards_count: 4,
  },
};

// 5. Массив объектов для группировки
const trainingEvents = [
  { id: 1, type: "card_created", date: "2024-03-01", user_id: "user-123" },
  { id: 2, type: "transaction", date: "2024-03-02", user_id: "user-123" },
  { id: 3, type: "card_created", date: "2024-03-03", user_id: "user-456" },
  { id: 4, type: "transaction", date: "2024-03-04", user_id: "user-123" },
  { id: 5, type: "transaction", date: "2024-03-05", user_id: "user-789" },
  { id: 6, type: "card_created", date: "2024-03-06", user_id: "user-123" },
];

// 6. Объект с массивом для трансформации
const trainingAccount = {
  id: "acc-1",
  name: "Основной счет",
  cards: [
    {
      id: "card-1",
      masked_number: "**** 1234",
      balance: "1000.00",
      currency: "USD",
    },
    {
      id: "card-2",
      masked_number: "**** 5678",
      balance: "2500.00",
      currency: "EUR",
    },
    {
      id: "card-3",
      masked_number: "**** 9012",
      balance: "500.00",
      currency: "USD",
    },
  ],
  total_balance: "4000.00",
  created_at: "2023-01-01",
};

export default {
  trainingCards,
  trainingCardBins,
  trainingTransactions,
  trainingUserProfile,
  trainingEvents,
  trainingAccount,
};
