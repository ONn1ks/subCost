'use strict';

const AVERAGE_DAYS_IN_MONTH = 30.4375;
const STORAGE_KEY = 'subcost_subscriptions_v1';
const SETTINGS_KEY = 'subcost_settings_v1';
const currencySymbols = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  GBP: '£',
  KZT: '₸',
  UAH: '₴',
  BYN: 'Br',
  TRY: '₺',
};

const currencyToRub = {
  RUB: 1,
  USD: 92,
  EUR: 100,
  GBP: 114,
  KZT: 0.2,
  UAH: 2.6,
  BYN: 30,
  TRY: 3.3,
};

const defaultCategories = [
  'Видео',
  'Музыка',
  'Игры',
  'Образование',
  'Продуктивность',
  'Финансы',
  'Здоровье',
  'Облако',
  'Инструменты',
  'Развлечения',
  'Связь',
  'Новости',
  'Безопасность',
];

const topInternational = [
  { name: 'Netflix', category: 'Видео', price: 9.99, currency: 'USD', frequency: 'monthly', description: 'Фильмы и сериалы без ограничений', color: '#E50914' },
  { name: 'Disney+', category: 'Видео', price: 7.99, currency: 'USD', frequency: 'monthly', description: 'Контент Disney, Marvel и Star Wars', color: '#113CCF' },
  { name: 'Spotify Premium', category: 'Музыка', price: 10.99, currency: 'USD', frequency: 'monthly', description: 'Музыка без рекламы и офлайн режим', color: '#1DB954' },
  { name: 'YouTube Premium', category: 'Видео', price: 11.99, currency: 'USD', frequency: 'monthly', description: 'Просмотр без рекламы и YouTube Music', color: '#FF0000' },
  { name: 'Amazon Prime Video', category: 'Видео', price: 14.99, currency: 'USD', frequency: 'monthly', description: 'Фильмы, сериалы и доставка Prime', color: '#00A8E1' },
  { name: 'Apple TV+', category: 'Видео', price: 9.99, currency: 'USD', frequency: 'monthly', description: 'Оригинальные сериалы Apple', color: '#0B84FE' },
  { name: 'HBO Max', category: 'Видео', price: 15.99, currency: 'USD', frequency: 'monthly', description: 'Премьеры Warner Bros. и HBO', color: '#5A1FC2' },
  { name: 'Hulu', category: 'Видео', price: 7.99, currency: 'USD', frequency: 'monthly', description: 'Телешоу и сериалы США', color: '#1CE783' },
  { name: 'Paramount+', category: 'Видео', price: 9.99, currency: 'USD', frequency: 'monthly', description: 'Фильмы и спортивные трансляции', color: '#0064FF' },
  { name: 'Apple Music', category: 'Музыка', price: 10.99, currency: 'USD', frequency: 'monthly', description: 'Музыка и lossless треки', color: '#FA2D48' },
  { name: 'Google One 200 ГБ', category: 'Облако', price: 2.99, currency: 'USD', frequency: 'monthly', description: 'Хранилище Google и VPN', color: '#4285F4' },
  { name: 'Dropbox Plus', category: 'Облако', price: 11.99, currency: 'USD', frequency: 'monthly', description: '2 ТБ облака и синхронизация', color: '#0061FF' },
  { name: 'Microsoft 365 Personal', category: 'Продуктивность', price: 6.99, currency: 'USD', frequency: 'monthly', description: 'Office и 1 ТБ OneDrive', color: '#F25022' },
  { name: 'Adobe Creative Cloud', category: 'Продуктивность', price: 59.99, currency: 'USD', frequency: 'monthly', description: 'Полный пакет Adobe', color: '#EC1C24' },
  { name: 'Canva Pro', category: 'Продуктивность', price: 12.99, currency: 'USD', frequency: 'monthly', description: 'Дизайн и шаблоны', color: '#00C4CC' },
  { name: 'Notion Plus', category: 'Продуктивность', price: 8, currency: 'USD', frequency: 'monthly', description: 'Рабочие пространства без ограничений', color: '#242424' },
  { name: 'Figma Professional', category: 'Продуктивность', price: 12, currency: 'USD', frequency: 'monthly', description: 'Дизайн для команд', color: '#A259FF' },
  { name: 'LinkedIn Premium', category: 'Карьера', price: 39.99, currency: 'USD', frequency: 'monthly', description: 'Инструменты поиска работы', color: '#0A66C2' },
  { name: 'Duolingo Super', category: 'Образование', price: 12.99, currency: 'USD', frequency: 'monthly', description: 'Изучение языков без рекламы', color: '#58CC02' },
  { name: 'Grammarly Premium', category: 'Образование', price: 30, currency: 'USD', frequency: 'monthly', description: 'Проверка английских текстов', color: '#14C8A8' },
  { name: 'Coursera Plus', category: 'Образование', price: 59, currency: 'USD', frequency: 'monthly', description: 'Безлимитный доступ к курсам', color: '#2A73CC' },
  { name: 'Skillshare', category: 'Образование', price: 19, currency: 'USD', frequency: 'monthly', description: 'Креативные курсы от практиков', color: '#00FF84' },
  { name: 'Calm', category: 'Здоровье', price: 14.99, currency: 'USD', frequency: 'monthly', description: 'Медитации и звуки сна', color: '#0A4BA6' },
  { name: 'Headspace', category: 'Здоровье', price: 12.99, currency: 'USD', frequency: 'monthly', description: 'Осознанность и медитации', color: '#FF9F1C' },
  { name: 'Crunchyroll', category: 'Видео', price: 9.99, currency: 'USD', frequency: 'monthly', description: 'Аниме без задержек и рекламы', color: '#F47521' },
  { name: 'Xbox Game Pass Ultimate', category: 'Игры', price: 16.99, currency: 'USD', frequency: 'monthly', description: 'Игры Xbox, PC и облако', color: '#0E7A0D' },
  { name: 'PlayStation Plus Extra', category: 'Игры', price: 17.99, currency: 'USD', frequency: 'monthly', description: 'Каталог игр и мультиплеер', color: '#003791' },
  { name: 'NordVPN', category: 'Безопасность', price: 12.99, currency: 'USD', frequency: 'monthly', description: 'VPN и защита приватности', color: '#0052FF' },
  { name: 'Tidal HiFi Plus', category: 'Музыка', price: 19.99, currency: 'USD', frequency: 'monthly', description: 'HiFi и Dolby Atmos', color: '#00FFFF' },
  { name: 'Medium Membership', category: 'Новости', price: 5, currency: 'USD', frequency: 'monthly', description: 'Эксклюзивные статьи и поддержка авторов', color: '#02B875' },
  { name: 'Tinder Plus', category: 'Социальные сети', price: 14.99, currency: 'USD', frequency: 'monthly', description: 'Дополнительные функции знакомств', color: '#FD5068' },
];

const topRussian = [
  { name: 'Яндекс Плюс', category: 'Видео', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Фильмы, музыка и кешбэк', color: '#FCCA00' },
  { name: 'Кинопоиск HD', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Онлайн-кинотеатр Яндекса', color: '#FF5500' },
  { name: 'Okko', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Премьеры кино и спорт', color: '#4522A0' },
  { name: 'Ivi', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Фильмы и сериалы для всей семьи', color: '#7200F2' },
  { name: 'START', category: 'Видео', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Российские сериалы и эксклюзивы', color: '#FF3859' },
  { name: 'Premier', category: 'Видео', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Проекты ТНТ и Premier Originals', color: '#1C1C1C' },
  { name: 'Wink', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Кино и ТВ от Ростелекома', color: '#FE5000' },
  { name: 'Amediateka', category: 'Видео', price: 599, currency: 'RUB', frequency: 'monthly', description: 'Сериалы HBO и мировые премьеры', color: '#000000' },
  { name: 'more.tv', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Сериалы и шоу СТС Медиа', color: '#1E90FF' },
  { name: 'Megogo', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Фильмы, ТВ и спорт', color: '#27AE60' },
  { name: 'KION', category: 'Видео', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Онлайн-кинотеатр МТС', color: '#FF005C' },
  { name: 'RuTube Премиум', category: 'Видео', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Просмотр без рекламы', color: '#FF3B30' },
  { name: 'СберПрайм', category: 'Видео', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Скидки и сервисы Сбера', color: '#0AC259' },
  { name: 'VK Combo', category: 'Видео', price: 249, currency: 'RUB', frequency: 'monthly', description: 'Музыка, кешбэк и сервисы VK', color: '#2787F5' },
  { name: 'Яндекс Музыка', category: 'Музыка', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Музыка без рекламы', color: '#FFCC00' },
  { name: 'VK Музыка', category: 'Музыка', price: 169, currency: 'RUB', frequency: 'monthly', description: 'Плейлисты и чарты VK', color: '#4A76A8' },
  { name: 'SberZvuk', category: 'Музыка', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Музыка с рекомендациями ИИ', color: '#0AC259' },
  { name: 'MTS Music', category: 'Музыка', price: 169, currency: 'RUB', frequency: 'monthly', description: 'Музыкальный сервис МТС', color: '#E30611' },
  { name: 'ЛитРес', category: 'Книги', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Аудио и электронные книги', color: '#FF6B00' },
  { name: 'Storytel', category: 'Книги', price: 379, currency: 'RUB', frequency: 'monthly', description: 'Аудиокниги и подкасты', color: '#FF6D00' },
  { name: 'Bookmate', category: 'Книги', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Чтение и аудио в одном сервисе', color: '#FF6F3C' },
  { name: 'Яндекс.Диск 200 ГБ', category: 'Облако', price: 169, currency: 'RUB', frequency: 'monthly', description: 'Облачное хранилище и бэкапы', color: '#FCCA00' },
  { name: 'Облако Mail.ru 1 ТБ', category: 'Облако', price: 229, currency: 'RUB', frequency: 'monthly', description: 'Расширенное хранилище Mail.ru', color: '#168DE2' },
  { name: 'Okko Спорт', category: 'Спорт', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Трансляции футбола и UFC', color: '#5A2ABF' },
  { name: 'Boom', category: 'Музыка', price: 169, currency: 'RUB', frequency: 'monthly', description: 'Музыка и клипы от VK', color: '#191919' },
  { name: 'РБК Pro', category: 'Новости', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Аналитика и закрытый контент', color: '#009639' },
  { name: 'Коммерсантъ', category: 'Новости', price: 499, currency: 'RUB', frequency: 'monthly', description: 'Полный доступ к публикациям', color: '#1E1E1E' },
  { name: 'МойОфис Облако', category: 'Продуктивность', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Пакет офисных приложений', color: '#2E7D32' },
  { name: 'Тинькофф Pro', category: 'Финансы', price: 199, currency: 'RUB', frequency: 'monthly', description: 'Повышенный кешбэк и лимиты', color: '#FFDD2D' },
  { name: 'Смотрёшка', category: 'Видео', price: 399, currency: 'RUB', frequency: 'monthly', description: 'Онлайн ТВ и фильмы', color: '#FF6A00' },
  { name: 'Beeline ТВ', category: 'Видео', price: 349, currency: 'RUB', frequency: 'monthly', description: 'Телевидение и фильмы', color: '#FFD600' },
  { name: 'Триколор Онлайн', category: 'Видео', price: 299, currency: 'RUB', frequency: 'monthly', description: 'Фильмотека и каналы', color: '#0E4FB2' },
];

const state = {
  subscriptions: [],
  editingId: null,
  baseCurrency: 'RUB',
  monthlyBudget: 0,
  filters: {
    search: '',
    frequency: 'all',
    category: '',
    sort: 'recent',
  },
  statsHistory: {
    monthly: [],
    yearly: [],
    count: [],
  },
  chart: null,
  pendingImageData: null,
  currentMonthlyTotal: 0,
};

const elements = {};

function init() {
  cacheElements();
  loadSettings();
  state.subscriptions = loadSubscriptions();
  renderTopLists();
  setupEventListeners();
  applySettingsToUI();
  refreshAll();
}

document.addEventListener('DOMContentLoaded', init);

function cacheElements() {
  elements.toast = document.getElementById('toast');
  elements.subscriptionForm = document.getElementById('subscriptionForm');
  elements.name = document.getElementById('name');
  elements.category = document.getElementById('category');
  elements.amount = document.getElementById('amount');
  elements.currency = document.getElementById('currency');
  elements.conversionField = document.getElementById('conversionField');
  elements.conversionRate = document.getElementById('conversionRate');
  elements.frequency = document.getElementById('frequency');
  elements.customIntervalField = document.getElementById('customIntervalField');
  elements.customInterval = document.getElementById('customInterval');
  elements.billingAnchor = document.getElementById('billingAnchor');
  elements.notes = document.getElementById('notes');
  elements.image = document.getElementById('image');
  elements.imagePreview = document.getElementById('imagePreview');
  elements.imagePreviewImg = elements.imagePreview?.querySelector('img');
  elements.submitButton = document.getElementById('submitButton');
  elements.cancelEdit = document.getElementById('cancelEdit');
  elements.formMessage = document.getElementById('formMessage');
  elements.searchInput = document.getElementById('searchInput');
  elements.frequencyFilter = document.getElementById('frequencyFilter');
  elements.categoryFilter = document.getElementById('categoryFilter');
  elements.sortSelect = document.getElementById('sortSelect');
  elements.clearAll = document.getElementById('clearAll');
  elements.monthlyTotal = document.getElementById('monthlyTotal');
  elements.yearlyTotal = document.getElementById('yearlyTotal');
  elements.averageCost = document.getElementById('averageCost');
  elements.averageInfo = document.getElementById('averageInfo');
  elements.mostExpensive = document.getElementById('mostExpensive');
  elements.expensiveInfo = document.getElementById('expensiveInfo');
  elements.monthlyDelta = document.getElementById('monthlyDelta');
  elements.yearlyDelta = document.getElementById('yearlyDelta');
  elements.heroMonthly = document.getElementById('heroMonthly');
  elements.heroYearly = document.getElementById('heroYearly');
  elements.heroCount = document.getElementById('heroCount');
  elements.heroMonthlyChange = document.getElementById('heroMonthlyChange');
  elements.heroYearlyChange = document.getElementById('heroYearlyChange');
  elements.heroNewCount = document.getElementById('heroNewCount');
  elements.monthlyBudget = document.getElementById('monthlyBudget');
  elements.budgetCurrency = document.getElementById('budgetCurrency');
  elements.budgetUsage = document.getElementById('budgetUsage');
  elements.budgetRest = document.getElementById('budgetRest');
  elements.budgetFill = document.getElementById('budgetFill');
  elements.exportButton = document.getElementById('exportButton');
  elements.importInput = document.getElementById('importInput');
  elements.downloadTemplate = document.getElementById('downloadTemplate');
  elements.baseCurrency = document.getElementById('baseCurrency');
  elements.topInternational = document.getElementById('topInternational');
  elements.topRussian = document.getElementById('topRussian');
  elements.tabInternational = document.getElementById('tabInternational');
  elements.tabRussian = document.getElementById('tabRussian');
  elements.subscriptionList = document.getElementById('subscriptionList');
  elements.emptyState = document.getElementById('emptyState');
  elements.upcomingPayments = document.getElementById('upcomingPayments');
  elements.insights = document.getElementById('insights');
  elements.categorySuggestions = document.getElementById('categorySuggestions');
}

function setupEventListeners() {
  elements.subscriptionForm.addEventListener('submit', handleFormSubmit);
  elements.cancelEdit.addEventListener('click', resetFormState);
  elements.frequency.addEventListener('change', handleFrequencyChange);
  elements.currency.addEventListener('change', handleCurrencyChange);
  elements.image.addEventListener('change', handleImageChange);

  elements.searchInput.addEventListener('input', (event) => {
    state.filters.search = event.target.value.toLowerCase();
    renderSubscriptions();
  });
  elements.frequencyFilter.addEventListener('change', (event) => {
    state.filters.frequency = event.target.value;
    renderSubscriptions();
  });
  elements.categoryFilter.addEventListener('input', (event) => {
    state.filters.category = event.target.value.toLowerCase();
    renderSubscriptions();
  });
  elements.sortSelect.addEventListener('change', (event) => {
    state.filters.sort = event.target.value;
    renderSubscriptions();
  });

  elements.clearAll.addEventListener('click', () => {
    if (!state.subscriptions.length) {
      showToast('Список подписок уже пуст.');
      return;
    }
    const confirmed = window.confirm('Удалить все подписки? Это действие нельзя отменить.');
    if (!confirmed) return;
    state.subscriptions = [];
    saveSubscriptions();
    refreshAll();
    showToast('Все подписки удалены.', 'success');
  });

  elements.exportButton.addEventListener('click', handleExport);
  elements.importInput.addEventListener('change', handleImport);
  elements.downloadTemplate.addEventListener('click', downloadTemplate);

  elements.baseCurrency.addEventListener('change', (event) => {
    state.baseCurrency = event.target.value;
    persistSettings();
    applySettingsToUI();
    refreshAll();
    showToast('Базовая валюта изменена. Обновите курсы подписок при необходимости.');
  });

  elements.monthlyBudget.addEventListener('input', (event) => {
    const value = Number.parseFloat(event.target.value);
    state.monthlyBudget = Number.isFinite(value) && value >= 0 ? value : 0;
    persistSettings();
    updateBudgetIndicator();
  });

  elements.tabInternational.addEventListener('click', () => switchTopTab('international'));
  elements.tabRussian.addEventListener('click', () => switchTopTab('russian'));
}

function handleFormSubmit(event) {
  event.preventDefault();
  const name = elements.name.value.trim();
  const amount = Number.parseFloat(elements.amount.value);
  const currency = elements.currency.value;
  const conversionRateValue = Number.parseFloat(elements.conversionRate.value);
  const conversionRate = Number.isFinite(conversionRateValue) && conversionRateValue > 0 ? conversionRateValue : 1;
  const category = elements.category.value.trim() || 'Без категории';
  const frequency = elements.frequency.value;
  const customInterval = frequency === 'custom' ? Number.parseInt(elements.customInterval.value, 10) : null;
  const billingAnchor = elements.billingAnchor.value || null;
  const notes = elements.notes.value.trim();

  if (!name) {
    setFormMessage('Введите название подписки.');
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    setFormMessage('Сумма должна быть положительной.');
    return;
  }
  if (frequency === 'custom' && (!Number.isInteger(customInterval) || customInterval <= 0)) {
    setFormMessage('Укажите длительность собственного периода.');
    return;
  }

  const amountInBase = amount * (currency === state.baseCurrency ? 1 : conversionRate);

  const payload = {
    name,
    category,
    amount,
    currency,
    conversionRate,
    amountInBase,
    billingFrequency: frequency,
    customIntervalDays: frequency === 'custom' ? customInterval : null,
    billingAnchor,
    notes,
    imageData: state.pendingImageData,
  };

  if (state.editingId) {
    updateSubscription(state.editingId, payload);
    showToast('Подписка обновлена.', 'success');
  } else {
    addSubscription(payload);
    showToast('Подписка добавлена.', 'success');
  }

  resetFormState();
  refreshAll();
}

function addSubscription(data) {
  const now = new Date().toISOString();
  const subscription = {
    id: createId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  state.subscriptions.unshift(subscription);
  saveSubscriptions();
}

function updateSubscription(id, data) {
  const index = state.subscriptions.findIndex((item) => item.id === id);
  if (index === -1) {
    showToast('Подписка для обновления не найдена.', 'error');
    return;
  }
  const current = state.subscriptions[index];
  state.subscriptions[index] = {
    ...current,
    ...data,
    imageData: data.imageData || current.imageData || null,
    updatedAt: new Date().toISOString(),
  };
  saveSubscriptions();
}

function deleteSubscription(id) {
  const index = state.subscriptions.findIndex((item) => item.id === id);
  if (index === -1) return;
  const confirmed = window.confirm('Удалить эту подписку?');
  if (!confirmed) return;
  state.subscriptions.splice(index, 1);
  saveSubscriptions();
  refreshAll();
  showToast('Подписка удалена.', 'success');
}

function duplicateSubscription(id) {
  const original = state.subscriptions.find((item) => item.id === id);
  if (!original) return;
  const now = new Date().toISOString();
  const copy = {
    ...original,
    id: createId(),
    name: `${original.name} (копия)`,
    createdAt: now,
    updatedAt: now,
  };
  state.subscriptions.unshift(copy);
  saveSubscriptions();
  refreshAll();
  showToast('Подписка продублирована.', 'success');
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function handleFrequencyChange(event) {
  const value = event.target.value;
  if (value === 'custom') {
    elements.customIntervalField.classList.remove('is-hidden');
  } else {
    elements.customIntervalField.classList.add('is-hidden');
    elements.customInterval.value = '';
  }
}

function handleCurrencyChange() {
  const currency = elements.currency.value;
  if (currency === state.baseCurrency) {
    elements.conversionField.classList.add('is-hidden');
    elements.conversionRate.value = '1';
  } else {
    elements.conversionField.classList.remove('is-hidden');
    const suggested = getDefaultRate(currency, state.baseCurrency);
    if (suggested) {
      elements.conversionRate.value = suggested;
    }
  }
}

function handleImageChange(event) {
  const [file] = event.target.files || [];
  if (!file) {
    state.pendingImageData = null;
    elements.imagePreview.classList.remove('is-visible');
    elements.imagePreviewImg.src = '';
    return;
  }
  if (!file.type.startsWith('image/')) {
    showToast('Загрузите файл изображения.', 'error');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.pendingImageData = reader.result;
    elements.imagePreviewImg.src = reader.result;
    elements.imagePreview.classList.add('is-visible');
  };
  reader.onerror = () => {
    showToast('Не удалось прочитать файл.', 'error');
  };
  reader.readAsDataURL(file);
}

function resetFormState() {
  elements.subscriptionForm.reset();
  elements.frequency.value = 'monthly';
  elements.currency.value = state.baseCurrency;
  elements.conversionRate.value = '1';
  elements.customIntervalField.classList.add('is-hidden');
  elements.imagePreview.classList.remove('is-visible');
  elements.imagePreviewImg.src = '';
  elements.submitButton.textContent = 'Сохранить подписку';
  elements.formMessage.textContent = '';
  state.editingId = null;
  state.pendingImageData = null;
  handleCurrencyChange();
}

function startEdit(id) {
  const subscription = state.subscriptions.find((item) => item.id === id);
  if (!subscription) {
    showToast('Подписка не найдена.', 'error');
    return;
  }
  state.editingId = id;
  elements.name.value = subscription.name;
  elements.category.value = subscription.category || '';
  elements.amount.value = subscription.amount;
  elements.currency.value = subscription.currency;
  elements.conversionRate.value = subscription.currency === state.baseCurrency ? 1 : subscription.conversionRate;
  elements.frequency.value = subscription.billingFrequency;
  if (subscription.billingFrequency === 'custom') {
    elements.customIntervalField.classList.remove('is-hidden');
    elements.customInterval.value = subscription.customIntervalDays ?? '';
  } else {
    elements.customIntervalField.classList.add('is-hidden');
    elements.customInterval.value = '';
  }
  elements.billingAnchor.value = subscription.billingAnchor || '';
  elements.notes.value = subscription.notes || '';
  if (subscription.imageData) {
    elements.imagePreviewImg.src = subscription.imageData;
    elements.imagePreview.classList.add('is-visible');
    state.pendingImageData = subscription.imageData;
  } else {
    elements.imagePreview.classList.remove('is-visible');
    elements.imagePreviewImg.src = '';
    state.pendingImageData = null;
  }
  elements.submitButton.textContent = 'Обновить подписку';
  setFormMessage('Редактирование активной подписки. После сохранения расчёты обновятся.');
  handleCurrencyChange();
  elements.subscriptionForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setFormMessage(message) {
  elements.formMessage.textContent = message;
}

function loadSubscriptions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeSubscription).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.warn('Не удалось загрузить подписки:', error);
    return [];
  }
}

function saveSubscriptions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.subscriptions));
}

function normalizeSubscription(item) {
  return {
    id: item.id || createId(),
    name: item.name || 'Без названия',
    category: item.category || 'Без категории',
    amount: Number.parseFloat(item.amount) || 0,
    currency: item.currency || state.baseCurrency,
    conversionRate: Number.isFinite(Number.parseFloat(item.conversionRate)) ? Number.parseFloat(item.conversionRate) : 1,
    amountInBase: Number.isFinite(Number.parseFloat(item.amountInBase))
      ? Number.parseFloat(item.amountInBase)
      : (Number.parseFloat(item.amount) || 0),
    billingFrequency: item.billingFrequency || 'monthly',
    customIntervalDays: item.customIntervalDays || null,
    billingAnchor: item.billingAnchor || null,
    notes: item.notes || '',
    imageData: item.imageData || null,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed.baseCurrency) state.baseCurrency = parsed.baseCurrency;
    if (Number.isFinite(parsed.monthlyBudget)) state.monthlyBudget = parsed.monthlyBudget;
  } catch (error) {
    console.warn('Не удалось загрузить настройки:', error);
  }
}

function persistSettings() {
  const payload = {
    baseCurrency: state.baseCurrency,
    monthlyBudget: state.monthlyBudget,
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
}

function applySettingsToUI() {
  elements.baseCurrency.value = state.baseCurrency;
  elements.currency.value = state.baseCurrency;
  elements.budgetCurrency.textContent = currencySymbols[state.baseCurrency] || state.baseCurrency;
  elements.monthlyBudget.value = state.monthlyBudget ? String(state.monthlyBudget) : '';
  handleCurrencyChange();
}

function refreshAll() {
  renderSubscriptions();
  updateSummary();
  updateBudgetIndicator();
  renderUpcomingPayments();
  renderInsights();
  updateCategorySuggestions();
  updateChart();
}

function renderSubscriptions() {
  elements.subscriptionList.innerHTML = '';
  const filtered = getFilteredSubscriptions();
  updateEmptyState(filtered.length === 0);

  filtered.forEach((subscription) => {
    const card = document.createElement('article');
    card.className = 'subscription-card';
    card.setAttribute('role', 'listitem');
    card.dataset.id = subscription.id;

    const cover = document.createElement('div');
    cover.className = 'subscription-cover';
    if (subscription.imageData) {
      const img = document.createElement('img');
      img.src = subscription.imageData;
      img.alt = `Обложка подписки ${subscription.name}`;
      cover.appendChild(img);
    } else {
      cover.textContent = getInitials(subscription.name);
    }

    const content = document.createElement('div');
    content.className = 'subscription-content';

    const header = document.createElement('div');
    header.className = 'subscription-header';
    const title = document.createElement('h3');
    title.textContent = subscription.name;
    header.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'subscription-actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Редактировать';
    editButton.addEventListener('click', () => startEdit(subscription.id));
    const duplicateButton = document.createElement('button');
    duplicateButton.type = 'button';
    duplicateButton.textContent = 'Дублировать';
    duplicateButton.addEventListener('click', () => duplicateSubscription(subscription.id));
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить';
    deleteButton.style.background = 'rgba(239, 68, 68, 0.12)';
    deleteButton.style.color = '#ef4444';
    deleteButton.addEventListener('click', () => deleteSubscription(subscription.id));
    actions.append(editButton, duplicateButton, deleteButton);
    header.appendChild(actions);

    const meta = document.createElement('div');
    meta.className = 'subscription-meta';
    const categoryTag = document.createElement('span');
    categoryTag.className = 'tag';
    categoryTag.textContent = subscription.category || 'Без категории';
    const frequencyTag = document.createElement('span');
    frequencyTag.className = 'tag secondary';
    frequencyTag.textContent = translateFrequency(subscription.billingFrequency, subscription.customIntervalDays);
    const currencyTag = document.createElement('span');
    currencyTag.className = 'tag-badge';
    currencyTag.textContent = subscription.currency;
    meta.append(categoryTag, frequencyTag, currencyTag);

    const prices = document.createElement('div');
    prices.className = 'subscription-prices';
    const monthlyBase = calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays);
    const yearlyBase = monthlyBase * 12;
    const monthlyOriginal = calculateMonthly(subscription.amount, subscription.billingFrequency, subscription.customIntervalDays);
    const monthlyBaseText = document.createElement('strong');
    monthlyBaseText.textContent = `${formatCurrency(monthlyBase, state.baseCurrency)} / мес`;
    const yearlyBaseText = document.createElement('span');
    yearlyBaseText.textContent = `${formatCurrency(yearlyBase, state.baseCurrency)} в год`;
    const originalText = document.createElement('span');
    if (subscription.currency !== state.baseCurrency) {
      originalText.textContent = `${formatCurrency(monthlyOriginal, subscription.currency)} / мес в валюте списания`;
    } else {
      originalText.textContent = `${formatCurrency(subscription.amount, subscription.currency)} за период`;
    }
    prices.append(monthlyBaseText, yearlyBaseText, originalText);

    const nextPaymentWrapper = document.createElement('div');
    nextPaymentWrapper.className = 'subscription-meta';
    const nextDateLabel = document.createElement('span');
    nextDateLabel.className = 'tag-badge';
    nextDateLabel.textContent = 'Ближайшее списание';
    const nextDateValue = document.createElement('span');
    nextDateValue.className = 'upcoming-date';
    const nextDate = computeNextPaymentDate(subscription);
    nextDateValue.textContent = nextDate ? formatDate(nextDate) : 'Не указано';
    nextPaymentWrapper.append(nextDateLabel, nextDateValue);

    content.append(header, meta, prices, nextPaymentWrapper);
    if (subscription.notes) {
      const notes = document.createElement('p');
      notes.className = 'subscription-notes';
      notes.textContent = subscription.notes;
      notes.style.margin = '4px 0 0';
      notes.style.color = 'var(--text-muted)';
      content.appendChild(notes);
    }

    card.append(cover, content);
    elements.subscriptionList.appendChild(card);
  });
}

function updateEmptyState(isEmpty) {
  if (isEmpty) {
    elements.emptyState.hidden = false;
    elements.subscriptionList.setAttribute('aria-hidden', 'true');
  } else {
    elements.emptyState.hidden = true;
    elements.subscriptionList.removeAttribute('aria-hidden');
  }
}

function getFilteredSubscriptions() {
  const { search, frequency, category, sort } = state.filters;
  const filtered = state.subscriptions.filter((subscription) => {
    const matchesSearch = !search
      || subscription.name.toLowerCase().includes(search)
      || (subscription.notes && subscription.notes.toLowerCase().includes(search));
    const matchesFrequency = frequency === 'all' || subscription.billingFrequency === frequency;
    const matchesCategory = !category || (subscription.category && subscription.category.toLowerCase().includes(category));
    return matchesSearch && matchesFrequency && matchesCategory;
  });
  return filtered.sort((a, b) => applySort(a, b, sort));
}

function applySort(a, b, sort) {
  if (sort === 'name') {
    return a.name.localeCompare(b.name, 'ru');
  }
  if (sort === 'cost-desc' || sort === 'cost-asc') {
    const monthlyA = calculateMonthly(a.amountInBase, a.billingFrequency, a.customIntervalDays);
    const monthlyB = calculateMonthly(b.amountInBase, b.billingFrequency, b.customIntervalDays);
    return sort === 'cost-desc' ? monthlyB - monthlyA : monthlyA - monthlyB;
  }
  return new Date(b.createdAt) - new Date(a.createdAt);
}

function calculateMonthly(amount, frequency, customInterval) {
  if (!Number.isFinite(amount)) return 0;
  switch (frequency) {
    case 'daily':
      return amount * AVERAGE_DAYS_IN_MONTH;
    case 'weekly':
      return amount * (52 / 12);
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    case 'custom':
      return customInterval ? amount * (AVERAGE_DAYS_IN_MONTH / customInterval) : amount;
    default:
      return amount;
  }
}

function computeNextPaymentDate(subscription) {
  if (!subscription.billingAnchor) return null;
  const startDate = new Date(subscription.billingAnchor);
  if (Number.isNaN(startDate.getTime())) return null;
  const today = new Date();
  let next = new Date(startDate);
  let counter = 0;
  while (next < today && counter < 1000) {
    next = addPeriod(next, subscription.billingFrequency, subscription.customIntervalDays);
    counter += 1;
  }
  return next;
}

function addPeriod(date, frequency, customInterval) {
  const next = new Date(date);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    case 'custom':
      next.setDate(next.getDate() + (customInterval || 1));
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next;
}

function updateSummary() {
  const totalMonthly = state.subscriptions.reduce(
    (sum, subscription) => sum + calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays),
    0,
  );
  const totalYearly = totalMonthly * 12;
  const averageMonthly = state.subscriptions.length ? totalMonthly / state.subscriptions.length : 0;
  const mostExpensive = state.subscriptions.reduce((current, subscription) => {
    const monthly = calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays);
    if (!current || monthly > current.monthly) {
      return { subscription, monthly };
    }
    return current;
  }, null);

  const prevMonthly = state.statsHistory.monthly.at(-1) ?? null;
  const prevYearly = state.statsHistory.yearly.at(-1) ?? null;
  const prevCount = state.statsHistory.count.at(-1) ?? null;
  state.statsHistory.monthly.push(totalMonthly);
  state.statsHistory.yearly.push(totalYearly);
  state.statsHistory.count.push(state.subscriptions.length);

  elements.monthlyTotal.textContent = formatCurrency(totalMonthly, state.baseCurrency);
  elements.yearlyTotal.textContent = formatCurrency(totalYearly, state.baseCurrency);
  elements.averageCost.textContent = formatCurrency(averageMonthly, state.baseCurrency);
  elements.averageInfo.textContent = state.subscriptions.length
    ? `Всего ${state.subscriptions.length} ${pluralize(state.subscriptions.length, ['подписка', 'подписки', 'подписок'])}`
    : 'Добавьте подписки, чтобы увидеть среднее значение';

  if (mostExpensive) {
    const monthlyOriginal = calculateMonthly(mostExpensive.subscription.amount, mostExpensive.subscription.billingFrequency, mostExpensive.subscription.customIntervalDays);
    elements.mostExpensive.textContent = mostExpensive.subscription.name;
    elements.expensiveInfo.textContent = `${formatCurrency(mostExpensive.monthly, state.baseCurrency)} в месяц (${formatCurrency(monthlyOriginal, mostExpensive.subscription.currency)} в валюте списания)`;
  } else {
    elements.mostExpensive.textContent = '—';
    elements.expensiveInfo.textContent = 'Добавьте подписку, чтобы увидеть лидера по расходам';
  }

  elements.monthlyDelta.textContent = describeDelta(totalMonthly, prevMonthly, true);
  elements.yearlyDelta.textContent = describeDelta(totalYearly, prevYearly, true);
  elements.heroMonthly.textContent = formatCurrency(totalMonthly, state.baseCurrency);
  elements.heroYearly.textContent = formatCurrency(totalYearly, state.baseCurrency);
  elements.heroCount.textContent = String(state.subscriptions.length);
  elements.heroMonthlyChange.textContent = describeDelta(totalMonthly, prevMonthly, true);
  elements.heroYearlyChange.textContent = describeDelta(totalYearly, prevYearly, true);
  elements.heroNewCount.textContent = describeDelta(state.subscriptions.length, prevCount, false, ['подписка', 'подписки', 'подписок']);

  state.currentMonthlyTotal = totalMonthly;
}

function updateBudgetIndicator() {
  const budget = state.monthlyBudget || 0;
  const totalMonthly = state.currentMonthlyTotal || 0;
  const symbol = currencySymbols[state.baseCurrency] || state.baseCurrency;
  elements.budgetCurrency.textContent = symbol;
  if (!budget) {
    elements.budgetUsage.textContent = 'Бюджет не задан';
    elements.budgetRest.textContent = `${symbol}0`;
    elements.budgetFill.style.width = '0%';
    elements.budgetFill.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
    return;
  }
  const usage = (totalMonthly / budget) * 100;
  const clamped = Math.min(usage, 130);
  elements.budgetFill.style.width = `${Math.max(0, clamped)}%`;
  elements.budgetFill.style.background = usage > 100
    ? 'linear-gradient(90deg, #ef4444, #f97316)'
    : 'linear-gradient(90deg, var(--primary), var(--secondary))';
  const rest = budget - totalMonthly;
  elements.budgetUsage.textContent = `${usage.toFixed(0)}% бюджета`;
  elements.budgetRest.textContent = rest >= 0
    ? `Остаток: ${formatCurrency(rest, state.baseCurrency)}`
    : `Перерасход: ${formatCurrency(Math.abs(rest), state.baseCurrency)}`;
}

function renderUpcomingPayments() {
  elements.upcomingPayments.innerHTML = '';
  const upcoming = state.subscriptions
    .map((subscription) => {
      const date = computeNextPaymentDate(subscription);
      if (!date) return null;
      return {
        name: subscription.name,
        date,
        amountBase: subscription.amountInBase,
        amount: subscription.amount,
        currency: subscription.currency,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date)
    .slice(0, 6);

  if (!upcoming.length) {
    const li = document.createElement('li');
    li.className = 'insight-item';
    li.textContent = 'Укажите даты списаний, чтобы видеть ближайшие платежи.';
    elements.upcomingPayments.appendChild(li);
    return;
  }

  upcoming.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'upcoming-item';
    const title = document.createElement('div');
    title.innerHTML = `<strong>${item.name}</strong><span class="upcoming-date">${formatDate(item.date)}</span>`;
    const amount = document.createElement('div');
    amount.innerHTML = `${formatCurrency(item.amountBase, state.baseCurrency)}<br><span class="upcoming-date">${formatCurrency(item.amount, item.currency)} в валюте списания</span>`;
    li.append(title, amount);
    elements.upcomingPayments.appendChild(li);
  });
}

function renderInsights() {
  elements.insights.innerHTML = '';
  if (!state.subscriptions.length) {
    const li = document.createElement('li');
    li.className = 'insight-item';
    li.textContent = 'Добавьте подписку, чтобы получить персональные рекомендации.';
    elements.insights.appendChild(li);
    return;
  }

  const totalMonthly = state.subscriptions.reduce(
    (sum, subscription) => sum + calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays),
    0,
  );
  const average = totalMonthly / state.subscriptions.length;
  const categoryTotals = state.subscriptions.reduce((acc, subscription) => {
    const category = subscription.category || 'Без категории';
    const monthly = calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays);
    acc[category] = (acc[category] || 0) + monthly;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const highest = state.subscriptions.reduce((current, subscription) => {
    const monthly = calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays);
    if (!current || monthly > current.monthly) {
      return { subscription, monthly };
    }
    return current;
  }, null);
  const upcoming = state.subscriptions
    .map((subscription) => ({ subscription, date: computeNextPaymentDate(subscription) }))
    .filter((item) => item.date)
    .sort((a, b) => a.date - b.date);

  const insights = [];
  if (topCategory) {
    const percent = totalMonthly ? ((topCategory[1] / totalMonthly) * 100).toFixed(1) : '0';
    insights.push(`Категория «${topCategory[0]}» занимает ${percent}% ежемесячных расходов.`);
  }
  if (highest) {
    insights.push(`Самая дорогая подписка — ${highest.subscription.name}: ${formatCurrency(highest.monthly, state.baseCurrency)} в месяц.`);
  }
  insights.push(`Средняя стоимость подписки — ${formatCurrency(average, state.baseCurrency)} в месяц.`);
  if (upcoming[0]) {
    insights.push(`Ближайшее списание: ${upcoming[0].subscription.name} — ${formatCurrency(upcoming[0].subscription.amountInBase, state.baseCurrency)} ${formatDate(upcoming[0].date)}.`);
  }
  if (state.monthlyBudget) {
    const rest = state.monthlyBudget - totalMonthly;
    insights.push(rest >= 0
      ? `В бюджете остаётся ${formatCurrency(rest, state.baseCurrency)} на новые сервисы.`
      : `Перерасход бюджета ${formatCurrency(Math.abs(rest), state.baseCurrency)} — возможно, пора пересмотреть подписки.`);
  }

  insights.slice(0, 5).forEach((text) => {
    const li = document.createElement('li');
    li.className = 'insight-item';
    li.textContent = text;
    elements.insights.appendChild(li);
  });
}

function updateCategorySuggestions() {
  const categories = new Set([
    ...defaultCategories,
    ...topInternational.map((item) => item.category),
    ...topRussian.map((item) => item.category),
    ...state.subscriptions.map((item) => item.category),
  ].filter(Boolean));
  elements.categorySuggestions.innerHTML = '';
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    elements.categorySuggestions.appendChild(option);
  });
}

function updateChart() {
  const canvas = document.getElementById('categoryChart');
  if (!canvas) return;
  const grouped = state.subscriptions.reduce((acc, subscription) => {
    const category = subscription.category || 'Без категории';
    const monthly = calculateMonthly(subscription.amountInBase, subscription.billingFrequency, subscription.customIntervalDays);
    acc[category] = (acc[category] || 0) + monthly;
    return acc;
  }, {});
  const labels = Object.keys(grouped);
  const data = labels.map((label) => Number(grouped[label].toFixed(2)));
  const backgroundColor = generatePalette(labels.length);

  if (!state.chart) {
    state.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor,
            borderWidth: 0,
            hoverOffset: 14,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#1f2333',
              font: { family: 'Inter, sans-serif' },
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.label}: ${formatCurrency(context.parsed, state.baseCurrency)}`;
              },
            },
          },
        },
      },
    });
  } else {
    state.chart.data.labels = labels;
    state.chart.data.datasets[0].data = data;
    state.chart.data.datasets[0].backgroundColor = backgroundColor;
    state.chart.update();
  }
}

function generatePalette(count) {
  const palette = ['#5b4bff', '#00b6f1', '#ff8f56', '#22c55e', '#f97316', '#a855f7', '#0ea5e9', '#14b8a6', '#ef4444', '#6366f1', '#f59e0b', '#10b981'];
  const colors = [];
  for (let index = 0; index < count; index += 1) {
    colors.push(palette[index % palette.length]);
  }
  return colors;
}

function renderTopLists() {
  elements.topInternational.innerHTML = '';
  elements.topRussian.innerHTML = '';
  topInternational.forEach((item) => {
    elements.topInternational.appendChild(createTopCard(item));
  });
  topRussian.forEach((item) => {
    elements.topRussian.appendChild(createTopCard(item));
  });
}

function createTopCard(item) {
  const card = document.createElement('article');
  card.className = 'top-card';
  const header = document.createElement('div');
  header.className = 'top-card__header';
  const avatar = document.createElement('div');
  avatar.className = 'top-card__avatar';
  if (item.color) {
    avatar.style.background = item.color;
  }
  avatar.textContent = getInitials(item.name);
  const body = document.createElement('div');
  body.className = 'top-card__body';
  const title = document.createElement('h3');
  title.textContent = item.name;
  const description = document.createElement('p');
  description.className = 'top-card__description';
  description.textContent = item.description;
  body.append(title, description);
  header.append(avatar, body);

  const meta = document.createElement('div');
  meta.className = 'top-card__meta';
  const category = document.createElement('span');
  category.className = 'tag-badge';
  category.textContent = item.category;
  const price = document.createElement('span');
  price.textContent = formatCurrency(item.price, item.currency);
  const period = document.createElement('span');
  period.textContent = translateFrequency(item.frequency);
  meta.append(category, price, period);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mini-button';
  button.textContent = 'Добавить';
  button.addEventListener('click', () => prefillForm(item));

  card.append(header, meta, button);
  return card;
}

function prefillForm(item) {
  resetFormState();
  elements.name.value = item.name;
  elements.category.value = item.category || '';
  elements.amount.value = item.price || '';
  elements.currency.value = item.currency || state.baseCurrency;
  if (item.currency && item.currency !== state.baseCurrency) {
    elements.conversionField.classList.remove('is-hidden');
    elements.conversionRate.value = item.conversionRate || getDefaultRate(item.currency, state.baseCurrency) || 1;
  } else {
    elements.conversionField.classList.add('is-hidden');
    elements.conversionRate.value = '1';
  }
  elements.frequency.value = item.frequency || 'monthly';
  if (item.frequency === 'custom' && item.customInterval) {
    elements.customIntervalField.classList.remove('is-hidden');
    elements.customInterval.value = item.customInterval;
  }
  if (item.description) {
    elements.notes.value = item.description;
  }
  setFormMessage('Данные сервиса предзаполнены. Проверьте стоимость и сохраните подписку.');
  elements.subscriptionForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getDefaultRate(currency, baseCurrency) {
  if (!currency || !baseCurrency) return null;
  const currencyRub = currencyToRub[currency];
  const baseRub = currencyToRub[baseCurrency];
  if (!currencyRub || !baseRub) return null;
  return Number((currencyRub / baseRub).toFixed(4));
}

function switchTopTab(tab) {
  if (tab === 'international') {
    elements.tabInternational.classList.add('is-active');
    elements.tabInternational.setAttribute('aria-selected', 'true');
    elements.tabRussian.classList.remove('is-active');
    elements.tabRussian.setAttribute('aria-selected', 'false');
    elements.topInternational.classList.remove('is-hidden');
    elements.topRussian.classList.add('is-hidden');
  } else {
    elements.tabRussian.classList.add('is-active');
    elements.tabRussian.setAttribute('aria-selected', 'true');
    elements.tabInternational.classList.remove('is-active');
    elements.tabInternational.setAttribute('aria-selected', 'false');
    elements.topRussian.classList.remove('is-hidden');
    elements.topInternational.classList.add('is-hidden');
  }
}

function handleExport() {
  const payload = {
    exportedAt: new Date().toISOString(),
    baseCurrency: state.baseCurrency,
    monthlyBudget: state.monthlyBudget,
    subscriptions: state.subscriptions,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `subcost-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('Данные экспортированы в JSON-файл.', 'success');
}

function handleImport(event) {
  const [file] = event.target.files || [];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const subscriptions = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.subscriptions)
          ? parsed.subscriptions
          : [];
      if (!subscriptions.length) {
        showToast('В файле нет данных подписок.', 'error');
        return;
      }
      state.subscriptions = subscriptions.map(normalizeSubscription);
      saveSubscriptions();
      refreshAll();
      showToast(`Импортировано ${subscriptions.length} ${pluralize(subscriptions.length, ['подписка', 'подписки', 'подписок'])}.`, 'success');
    } catch (error) {
      console.error('Ошибка импорта', error);
      showToast('Не удалось импортировать файл. Проверьте формат JSON.', 'error');
    }
  };
  reader.onerror = () => {
    showToast('Ошибка чтения файла.', 'error');
  };
  reader.readAsText(file);
  event.target.value = '';
}

function downloadTemplate() {
  const headers = ['name', 'category', 'amount', 'currency', 'conversionRate', 'billingFrequency', 'customIntervalDays', 'billingAnchor', 'notes'];
  const rows = [
    ['Netflix', 'Видео', '9.99', 'USD', '92', 'monthly', '', '2024-05-01', 'Тариф Standard'],
    ['Яндекс Плюс', 'Видео', '299', 'RUB', '1', 'monthly', '', '2024-05-05', 'Промокод на 3 месяца'],
  ];
  const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'subcost-template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('CSV-шаблон скачан.', 'success');
}

function describeDelta(current, previous, isCurrency = true, forms = ['пункт', 'пункта', 'пунктов']) {
  if (previous === null || previous === undefined) {
    return 'Новые данные';
  }
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) {
    return 'Без изменений';
  }
  if (isCurrency) {
    const value = formatCurrency(Math.abs(diff), state.baseCurrency);
    return diff > 0 ? `+${value} с прошлого обновления` : `-${value} с прошлого обновления`;
  }
  const amount = Math.abs(Math.round(diff));
  return diff > 0
    ? `+${amount} ${pluralize(amount, forms)}`
    : `-${amount} ${pluralize(amount, forms)}`;
}

function formatCurrency(value, currency) {
  const symbol = currencySymbols[currency] || '';
  const number = Number.isFinite(value) ? value : 0;
  const formatted = number.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${symbol}${formatted}`;
}

function formatDate(date) {
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

function pluralize(count, forms) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

function translateFrequency(frequency, customInterval) {
  switch (frequency) {
    case 'daily':
      return 'Ежедневно';
    case 'weekly':
      return 'Еженедельно';
    case 'monthly':
      return 'Ежемесячно';
    case 'quarterly':
      return 'Ежеквартально';
    case 'yearly':
      return 'Ежегодно';
    case 'custom':
      return customInterval ? `Каждые ${customInterval} дней` : 'Пользовательский период';
    default:
      return 'Ежемесячно';
  }
}

function getInitials(name) {
  if (!name) return 'S';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

function showToast(message, type = 'info') {
  const toast = elements.toast;
  toast.textContent = message;
  toast.classList.remove('error', 'success', 'is-visible');
  if (type !== 'info') {
    toast.classList.add(type === 'error' ? 'error' : 'success');
  }
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });
  setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}
