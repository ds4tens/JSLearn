/**
 * ПОДСКАЗКИ для проверки решений
 *
 * ВНИМАНИЕ: Этот файл содержит примеры решений.
 * Не смотрите сюда, пока не попробуете решить самостоятельно!
 *
 * Попробуйте сначала решить задание сами, и только потом
 * сверьтесь с этими примерами для проверки.
 */

// ============================================================
// УРОВЕНЬ 1: Базовые операции с объектами
// ============================================================

function getCardNameHint(card) {
  return card.name;
}

function isCardActiveHint(card) {
  return card.status === "Активная";
}

function getCardBalanceHint(card) {
  return card.balance ?? "0.00";
}

// ============================================================
// УРОВЕНЬ 2: Вложенные объекты
// ============================================================

function getCardTypeNameHint(card) {
  return card.type.name;
}

function isDailyLimitAllowedHint(card) {
  return card.type.allowed_daily_limit;
}

function getAutoTopupSettingsHint(card) {
  if (!card.top_up) {
    return null;
  }
  return {
    threshold: card.top_up.top_up_threshold,
    amount: card.top_up.top_up_amount,
    is_active: card.top_up.top_up_is_active,
  };
}

// ============================================================
// УРОВЕНЬ 3: Массивы объектов
// ============================================================

function countActiveCardsHint(cards) {
  return cards.filter((card) => card.status === "Активная").length;
}

function getAllUniqueTagsHint(cards) {
  const allTags = cards.flatMap((card) => card.tags);
  const uniqueTagNames = new Set(allTags.map((tag) => tag.name));
  return Array.from(uniqueTagNames);
}

function findCardWithMaxBalanceHint(cards) {
  if (cards.length === 0) return null;

  return cards.reduce((maxCard, currentCard) => {
    return parseFloat(currentCard.balance) > parseFloat(maxCard.balance)
      ? currentCard
      : maxCard;
  });
}

function getCardsWithoutLimitsHint(cards) {
  return cards.filter((card) => !card.limits).map((card) => ({ id: card.id }));
}

// ============================================================
// УРОВЕНЬ 4: Трансформация объектов
// ============================================================

function createSimplifiedCardHint(card) {
  return {
    id: card.id,
    name: card.name,
    balance: card.balance,
    currency: card.currency,
  };
}

function renameCardHint(card, newName) {
  return { ...card, name: newName };
}

function addTagToCardHint(card, newTag) {
  return {
    ...card,
    tags: [...card.tags, newTag],
  };
}

function updateCardBalanceHint(card, newBalance) {
  return {
    ...card,
    balance: newBalance,
  };
}

// ============================================================
// УРОВЕНЬ 5: Группировка и агрегация
// ============================================================

function groupCardsByStatusHint(cards) {
  return cards.reduce((groups, card) => {
    const status = card.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(card);
    return groups;
  }, {});
}

function calculateTotalBalanceHint(cards) {
  return cards.reduce((total, card) => {
    return total + parseFloat(card.balance);
  }, 0);
}

function createCardsSummaryHint(cards) {
  const active = cards.filter((card) => card.status === "Активная").length;
  const total_balance = cards.reduce(
    (sum, card) => sum + parseFloat(card.balance),
    0,
  );

  return {
    total: cards.length,
    active,
    total_balance,
  };
}

// ============================================================
// УРОВЕНЬ 6: Глубокие вложенности
// ============================================================

function getUserNotificationsHint(user) {
  return user.settings?.notifications ?? null;
}

function isTwoFactorEnabledHint(user) {
  return user.settings?.security?.two_factor_enabled ?? false;
}

// ============================================================
// УРОВЕНЬ 7: Преобразование структур
// ============================================================

function convertCardsArrayToObjectHint(cards) {
  return cards.reduce((acc, card) => {
    acc[card.id] = card;
    return acc;
  }, {});
}

function extractCardDisplayFieldsHint(card) {
  const { id, name, masked_card_number, payment_system } = card;
  return { id, name, masked_card_number, payment_system };
}

function mergeCardSettingsHint(baseSettings, overrideSettings) {
  return { ...baseSettings, ...overrideSettings };
}

// ============================================================
// УРОВЕНЬ 8: Сложная фильтрация
// ============================================================

function findCardsWithLimitAboveHint(cards, limitType, threshold) {
  return cards
    .filter((card) => {
      const limit = card.limits?.[limitType];
      return limit && parseFloat(limit) > parseFloat(threshold);
    })
    .map((card) => ({ id: card.id }));
}

function getFavoriteCardsSortedHint(cards) {
  return cards
    .filter((card) => card.is_favorite)
    .sort(
      (a, b) =>
        parseFloat(b.issue_cost.amount) - parseFloat(a.issue_cost.amount),
    )
    .map((card) => card.id);
}

// ============================================================
// УРОВЕНЬ 9: Работа с массивами в объектах
// ============================================================

function addCardToAccountHint(account, newCard) {
  return {
    ...account,
    cards: [...account.cards, newCard],
  };
}

function removeTagFromAllCardsHint(cards, tagId) {
  return cards.map((card) => ({
    ...card,
    tags: card.tags.filter((tag) => tag.id !== tagId),
  }));
}

function updateCardInArrayHint(cards, cardId, updates) {
  return cards.map((card) =>
    card.id === cardId ? { ...card, ...updates } : card,
  );
}

export default {
  getCardNameHint,
  isCardActiveHint,
  getCardBalanceHint,
  getCardTypeNameHint,
  isDailyLimitAllowedHint,
  getAutoTopupSettingsHint,
  countActiveCardsHint,
  getAllUniqueTagsHint,
  findCardWithMaxBalanceHint,
  getCardsWithoutLimitsHint,
  createSimplifiedCardHint,
  renameCardHint,
  addTagToCardHint,
  updateCardBalanceHint,
  groupCardsByStatusHint,
  calculateTotalBalanceHint,
  createCardsSummaryHint,
  getUserNotificationsHint,
  isTwoFactorEnabledHint,
  convertCardsArrayToObjectHint,
  extractCardDisplayFieldsHint,
  mergeCardSettingsHint,
  findCardsWithLimitAboveHint,
  getFavoriteCardsSortedHint,
  addCardToAccountHint,
  removeTagFromAllCardsHint,
  updateCardInArrayHint,
};
