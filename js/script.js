// Мобільне меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Рік у футері
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Поява секцій під час прокрутки
const revealTargets = document.querySelectorAll(
  '.card, .feature, .review, .product, .process__step, .about__content, .about__art, .section__head'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// Кнопка "Догори"
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Підсвітка за курсором у hero
const heroSection = document.querySelector('.hero');
const heroGlow = document.querySelector('.hero__glow');
if (heroSection && heroGlow) {
  heroSection.addEventListener('mousemove', (event) => {
    const rect = heroSection.getBoundingClientRect();
    heroSection.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    heroSection.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });
}

// Копіювання номера телефону по кліку
const copyPhoneBtn = document.getElementById('copyPhoneBtn');
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* noop */ }
  document.body.removeChild(ta);
  return Promise.resolve();
}
if (copyPhoneBtn) {
  copyPhoneBtn.addEventListener('click', () => {
    copyText(copyPhoneBtn.dataset.copyValue).then(() => {
      copyPhoneBtn.classList.add('is-copied');
      setTimeout(() => copyPhoneBtn.classList.remove('is-copied'), 1600);
    });
  });
}

// Фільтри товарів у магазині (за сезоном)
const shopFilters = document.getElementById('shopFilters');
if (shopFilters) {
  const shopProducts = document.querySelectorAll('#shopGrid .product');
  const shopEmpty = document.getElementById('shopEmpty');

  shopFilters.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-filter]');
    if (!btn) return;

    shopFilters.querySelectorAll('[data-filter]').forEach((el) => {
      el.classList.toggle('is-active', el === btn);
    });

    const filter = btn.dataset.filter;
    let visibleCount = 0;
    shopProducts.forEach((product) => {
      const matches = filter === 'all' || product.dataset.season === filter;
      product.style.display = matches ? '' : 'none';
      if (matches) visibleCount += 1;
    });

    if (shopEmpty) shopEmpty.style.display = visibleCount ? 'none' : 'block';
  });
}

// Стрічка категорій: набір з 8 позицій повторюємо кілька разів,
// щоб на будь-якій ширині екрана стрічка ніколи не "закінчувалась" під час циклу.
const TIRE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.7"/></svg>';
const DISC_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/></svg>';
const PART_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3 17.7 3.3l2 2-3 3 1 1 3-3 1 1c1 1-.2 2.9-1.6 4.3-1.4 1.4-3.3 2.6-4.3 1.6l-9 9c-1 1-2.6 1-3.5 0-1-1-1-2.6 0-3.5l9-9c-1-1 .2-2.9 1.6-4.3.3-.3.6-.5.8-.8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
const STORAGE_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.6"/></svg>';

const MARQUEE_ITEMS = [
  { key: 'mq_1', icon: TIRE_ICON },
  { key: 'mq_2', icon: TIRE_ICON },
  { key: 'mq_3', icon: DISC_ICON },
  { key: 'mq_4', icon: DISC_ICON },
  { key: 'mq_5', icon: PART_ICON },
  { key: 'mq_6', icon: STORAGE_ICON },
  { key: 'mq_7', icon: TIRE_ICON },
  { key: 'mq_8', icon: DISC_ICON },
];
const MARQUEE_REPEATS = 4;
const marqueeTrack = document.getElementById('marqueeTrack');

function renderMarquee(dict) {
  if (!marqueeTrack) return;
  let html = '';
  for (let r = 0; r < MARQUEE_REPEATS; r += 1) {
    MARQUEE_ITEMS.forEach((item) => {
      html += `<span class="marquee__item">${item.icon}<span>${dict[item.key]}</span></span>`;
    });
  }
  marqueeTrack.innerHTML = html;
}

// ===== Двомовність (UA / RU) =====
const VIBER_NUMBER = '%2B380955525256'; // +380955525256, URL-encoded для viber://
function viberLink(text) {
  return text
    ? `viber://chat?number=${VIBER_NUMBER}&text=${encodeURIComponent(text)}`
    : `viber://chat?number=${VIBER_NUMBER}`;
}

const translations = {
  uk: {
    nav_home: 'Головна', nav_about: 'Про нас', nav_services: 'Послуги', nav_why: 'Переваги',
    nav_process: 'Як це працює', nav_reviews: 'Відгуки', nav_contacts: 'Контакти',

    hero_badge: 'Працюємо 24/7, без вихідних',
    hero_title_main: 'Шини, диски та автозапчастини',
    hero_title_accent: 'для будь-якого автомобіля',
    hero_lead: 'Допоможемо підібрати шини й диски точно під ваш автомобіль, знайдемо потрібні запчастини та приймемо комплект сезонних шин на зберігання — швидко і без зайвих запитань.',
    btn_call: 'Подзвонити',
    btn_viber: 'Написати у Viber',
    perk_1: 'Шини, диски, запчастини', perk_2: 'Зберігання шин', perk_3: 'Допомога з підбором',
    chip_1: 'Шини', chip_2: 'Диски', chip_3: 'Запчастини',

    mq_1: 'Літні шини', mq_2: 'Зимові шини', mq_3: 'Диски литі', mq_4: 'Диски штамповані',
    mq_5: 'Автозапчастини', mq_6: 'Зберігання шин', mq_7: 'Всесезонні шини', mq_8: 'Диски ковані',

    about_eyebrow: 'Про компанію',
    about_title: "Планета ШИН — все для ваших коліс в одному місці",
    about_text: 'Ми займаємось продажем шин, дисків та автозапчастин для легкових автомобілів, кросоверів і вантажівок. Допомагаємо підібрати правильний розмір і варіант під ваш автомобіль та бюджет, а на міжсезоння приймаємо комплект шин на зберігання — щоб він не займав місце вдома чи в гаражі.',
    about_li_1: 'Підбір шин і дисків за параметрами автомобіля',
    about_li_2: 'Пошук та замовлення автозапчастин',
    about_li_3: 'Сезонне зберігання шин',
    about_li_4: "Консультація по телефону та в Viber — цілодобово",

    svc_eyebrow: 'Послуги', svc_title: 'Чим ми можемо допомогти',
    svc_1_title: 'Шини', svc_1_text: 'Літні, зимові та всесезонні шини для легкових авто, кросоверів і вантажного транспорту. Підберемо за розміром, сезоном і бюджетом.',
    svc_2_title: 'Диски', svc_2_text: 'Литі, ковані та штамповані диски. Допоможемо підібрати розболтовку, виліт і діаметр під ваш автомобіль.',
    svc_3_title: 'Автозапчастини', svc_3_text: 'Оригінальні та аналогові запчастини в наявності і під замовлення для більшості марок автомобілів.',
    svc_4_title: 'Зберігання шин', svc_4_text: 'Сезонне зберігання комплекту шин на складі — здали і забули до наступного сезону.',
    svc_link: 'Уточнити наявність →',

    nav_shop: 'Магазин',
    shop_eyebrow: 'Магазин', shop_title: 'Шини в наявності',
    shop_season_summer: 'Літня',
    spec_year: 'Рік випуску', spec_load: 'Індекс навантаження', spec_speed: 'Індекс швидкості',
    spec_reinforced: 'Підсилення', spec_studs: 'Шипи', spec_studs_no: 'Не шипована',
    shop_price: 'Ціна за запитом', shop_order: 'Замовити',
    shop_note: 'Асортимент постійно поповнюється — питайте про наявність потрібного розміру.',
    filter_all: 'Всі', filter_summer: 'Літні', filter_winter: 'Зимові', filter_allseason: 'Всесезонні',
    shop_empty: 'У цій категорії поки немає товарів. Напишіть нам — можемо підібрати під замовлення.',
    shop_inquiry_template: 'Доброго дня! Цікавить {product}, чи є в наявності?',

    why_eyebrow: 'Чому ми', why_title: 'Переваги роботи з нами',
    why_1_title: 'Працюємо 24/7', why_1_text: 'Без вихідних і свят — телефонуйте або пишіть у будь-який зручний час.',
    why_2_title: 'Великий вибір', why_2_text: 'Шини, диски та запчастини під найрізноманітніші марки й моделі авто.',
    why_3_title: 'Точний підбір', why_3_text: 'Враховуємо марку, модель і параметри авто, щоб не помилитися з розміром.',
    why_4_title: 'Зберігання шин', why_4_text: 'Залиште сезонний комплект у нас — не потрібно шукати місце вдома.',
    why_5_title: "Швидкий зв'язок", why_5_text: 'Відповідаємо на дзвінки та повідомлення у Viber без довгого очікування.',
    why_6_title: 'Чесні рекомендації', why_6_text: 'Пропонуємо варіанти під ваш бюджет, а не найдорожчі позиції.',

    proc_eyebrow: 'Процес', proc_title: 'Як ми працюємо',
    proc_1_title: 'Зателефонуйте або напишіть', proc_1_text: 'Розкажіть, що потрібно: марка й модель авто, розмір шин чи дисків, потрібна запчастина.',
    proc_2_title: 'Підберемо варіант', proc_2_text: 'Запропонуємо доступні варіанти шин, дисків або запчастин під ваш бюджет.',
    proc_3_title: 'Заберіть замовлення', proc_3_text: 'Заберіть готове замовлення або домовтесь про сезонне зберігання комплекту шин.',

    rev_eyebrow: 'Відгуки', rev_title: 'Що кажуть клієнти',
    rev_google_cta: '{rating} ★ · {count} відгуків на Google Картах →',

    contact_eyebrow: 'Контакти', contact_title: "Зв'яжіться з нами",
    contact_phone_label: 'Телефон',
    contact_viber_value: 'Написати повідомлення',
    contact_hours_label: 'Режим роботи', contact_hours_value: 'Цілодобово, без вихідних',
    contact_address_label: 'Адреса', contact_address_value: 'вул. Космічна, 49, Дніпро, 49000',
    copied_hint: 'Скопійовано!',

    form_title: 'Залишити заявку у Viber',
    form_name: "Ваше ім'я", form_phone: 'Ваш телефон', form_msg: 'Що потрібно підібрати? (шини, диски, запчастини...)',
    form_submit: 'Надіслати у Viber',

    footer_tagline: 'Шини, диски та автозапчастини для будь-якого автомобіля. Працюємо 24/7.',
    footer_rights: 'Всі права захищені.',

    viber_hero_text: 'Доброго дня! Цікавлять шини та диски.',
    viber_form_greeting: 'Доброго дня! Хочу залишити заявку з сайту Планета ШИН.',
    viber_form_name_label: "Ім'я", viber_form_phone_label: 'Телефон', viber_form_comment_label: 'Коментар',

    aria_scroll_top: 'Догори',

    meta_title: 'Планета ШИН — шини, диски та автозапчастини',
    meta_description: 'Планета ШИН — продаж шин, дисків та автозапчастин для будь-яких авто. Підбір під авто, сезонне зберігання шин. Працюємо 24/7.',
    shop_meta_title: 'Магазин — Планета ШИН',
    shop_meta_description: 'Каталог шин Планета ШИН — актуальна наявність, характеристики, замовлення через Viber.',
  },
  ru: {
    nav_home: 'Главная', nav_about: 'О нас', nav_services: 'Услуги', nav_why: 'Преимущества',
    nav_process: 'Как это работает', nav_reviews: 'Отзывы', nav_contacts: 'Контакты',

    hero_badge: 'Работаем 24/7, без выходных',
    hero_title_main: 'Шины, диски и автозапчасти',
    hero_title_accent: 'для любого автомобиля',
    hero_lead: 'Поможем подобрать шины и диски точно под ваш автомобиль, найдём нужные запчасти и примем комплект сезонных шин на хранение — быстро и без лишних вопросов.',
    btn_call: 'Позвонить',
    btn_viber: 'Написать в Viber',
    perk_1: 'Шины, диски, запчасти', perk_2: 'Хранение шин', perk_3: 'Помощь с подбором',
    chip_1: 'Шины', chip_2: 'Диски', chip_3: 'Запчасти',

    mq_1: 'Летние шины', mq_2: 'Зимние шины', mq_3: 'Диски литые', mq_4: 'Диски штампованные',
    mq_5: 'Автозапчасти', mq_6: 'Хранение шин', mq_7: 'Всесезонные шины', mq_8: 'Диски кованые',

    about_eyebrow: 'О компании',
    about_title: 'Планета ШИН — всё для ваших колёс в одном месте',
    about_text: 'Мы занимаемся продажей шин, дисков и автозапчастей для легковых автомобилей, кроссоверов и грузовиков. Помогаем подобрать правильный размер и вариант под ваш автомобиль и бюджет, а на межсезонье принимаем комплект шин на хранение — чтобы он не занимал место дома или в гараже.',
    about_li_1: 'Подбор шин и дисков по параметрам автомобиля',
    about_li_2: 'Поиск и заказ автозапчастей',
    about_li_3: 'Сезонное хранение шин',
    about_li_4: 'Консультация по телефону и в Viber — круглосуточно',

    svc_eyebrow: 'Услуги', svc_title: 'Чем мы можем помочь',
    svc_1_title: 'Шины', svc_1_text: 'Летние, зимние и всесезонные шины для легковых авто, кроссоверов и грузового транспорта. Подберём по размеру, сезону и бюджету.',
    svc_2_title: 'Диски', svc_2_text: 'Литые, кованые и штампованные диски. Поможем подобрать разболтовку, вылет и диаметр под ваш автомобиль.',
    svc_3_title: 'Автозапчасти', svc_3_text: 'Оригинальные и аналоговые запчасти в наличии и под заказ для большинства марок автомобилей.',
    svc_4_title: 'Хранение шин', svc_4_text: 'Сезонное хранение комплекта шин на складе — сдали и забыли до следующего сезона.',
    svc_link: 'Уточнить наличие →',

    nav_shop: 'Магазин',
    shop_eyebrow: 'Магазин', shop_title: 'Шины в наличии',
    shop_season_summer: 'Летняя',
    spec_year: 'Год выпуска', spec_load: 'Индекс нагрузки', spec_speed: 'Индекс скорости',
    spec_reinforced: 'Усиление', spec_studs: 'Шипы', spec_studs_no: 'Нешипованная',
    shop_price: 'Цена по запросу', shop_order: 'Заказать',
    shop_note: 'Ассортимент постоянно пополняется — спрашивайте о наличии нужного размера.',
    filter_all: 'Все', filter_summer: 'Летние', filter_winter: 'Зимние', filter_allseason: 'Всесезонные',
    shop_empty: 'В этой категории пока нет товаров. Напишите нам — можем подобрать под заказ.',
    shop_inquiry_template: 'Здравствуйте! Интересует {product}, есть в наличии?',

    why_eyebrow: 'Почему мы', why_title: 'Преимущества работы с нами',
    why_1_title: 'Работаем 24/7', why_1_text: 'Без выходных и праздников — звоните или пишите в любое удобное время.',
    why_2_title: 'Большой выбор', why_2_text: 'Шины, диски и запчасти под самые разные марки и модели авто.',
    why_3_title: 'Точный подбор', why_3_text: 'Учитываем марку, модель и параметры авто, чтобы не ошибиться с размером.',
    why_4_title: 'Хранение шин', why_4_text: 'Оставьте сезонный комплект у нас — не нужно искать место дома.',
    why_5_title: 'Быстрая связь', why_5_text: 'Отвечаем на звонки и сообщения в Viber без долгого ожидания.',
    why_6_title: 'Честные рекомендации', why_6_text: 'Предлагаем варианты под ваш бюджет, а не самые дорогие позиции.',

    proc_eyebrow: 'Процесс', proc_title: 'Как мы работаем',
    proc_1_title: 'Позвоните или напишите', proc_1_text: 'Расскажите, что нужно: марка и модель авто, размер шин или дисков, нужная запчасть.',
    proc_2_title: 'Подберём вариант', proc_2_text: 'Предложим доступные варианты шин, дисков или запчастей под ваш бюджет.',
    proc_3_title: 'Заберите заказ', proc_3_text: 'Заберите готовый заказ или договоритесь о сезонном хранении комплекта шин.',

    rev_eyebrow: 'Отзывы', rev_title: 'Что говорят клиенты',
    rev_google_cta: '{rating} ★ · {count} отзывов в Google Картах →',

    contact_eyebrow: 'Контакты', contact_title: 'Свяжитесь с нами',
    contact_phone_label: 'Телефон',
    contact_viber_value: 'Написать сообщение',
    contact_hours_label: 'Режим работы', contact_hours_value: 'Круглосуточно, без выходных',
    contact_address_label: 'Адрес', contact_address_value: 'ул. Космическая, 49, Днепр, 49000',
    copied_hint: 'Скопировано!',

    form_title: 'Оставить заявку в Viber',
    form_name: 'Ваше имя', form_phone: 'Ваш телефон', form_msg: 'Что нужно подобрать? (шины, диски, запчасти...)',
    form_submit: 'Отправить в Viber',

    footer_tagline: 'Шины, диски и автозапчасти для любого автомобиля. Работаем 24/7.',
    footer_rights: 'Все права защищены.',

    viber_hero_text: 'Здравствуйте! Интересуют шины и диски.',
    viber_form_greeting: 'Здравствуйте! Хочу оставить заявку с сайта Планета ШИН.',
    viber_form_name_label: 'Имя', viber_form_phone_label: 'Телефон', viber_form_comment_label: 'Комментарий',

    aria_scroll_top: 'Наверх',

    meta_title: 'Планета ШИН — шины, диски и автозапчасти',
    meta_description: 'Планета ШИН — продажа шин, дисков и автозапчастей для любых авто. Подбор под авто, сезонное хранение шин. Работаем 24/7.',
    shop_meta_title: 'Магазин — Планета ШИН',
    shop_meta_description: 'Каталог шин Планета ШИН — актуальное наличие, характеристики, заказ через Viber.',
  },
};

const LANG_STORAGE_KEY = 'planetaShinLang';
const heroViberBtn = document.getElementById('heroViberBtn');
const metaDescriptionEl = document.getElementById('metaDescription');
const ogDescriptionEl = document.getElementById('ogDescription');
const langToggle = document.getElementById('langToggle');
const floatingCallBtn = document.querySelector('.floating__btn--call');
const floatingViberBtn = document.querySelector('.floating__btn--viber');

// Ключі з підстановками ({rating}, {count}) — генеральний цикл нижче їх не чіпає,
// текст рахує renderReviewsNote() окремо.
const TEMPLATED_I18N_KEYS = new Set(['rev_google_cta']);
let currentLang = 'uk';
// Стартові значення відповідають статичному резервному вмісту в HTML;
// оновлюються реальними цифрами після успішного запиту до Google Places.
let reviewStats = { rating: 4.6, count: 19 };

function renderReviewsNote(dict) {
  const el = document.querySelector('[data-i18n="rev_google_cta"]');
  if (!el) return;
  el.textContent = dict.rev_google_cta
    .replace('{rating}', reviewStats.rating)
    .replace('{count}', reviewStats.count);
}

function updateProductViberLinks(dict) {
  document.querySelectorAll('[data-viber-product]').forEach((el) => {
    const text = dict.shop_inquiry_template.replace('{product}', el.dataset.viberProduct);
    el.href = viberLink(text);
  });
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.uk;
  currentLang = lang;

  document.documentElement.lang = lang;

  renderMarquee(dict);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (TEMPLATED_I18N_KEYS.has(key)) return;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  renderReviewsNote(dict);
  updateProductViberLinks(dict);

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  if (langToggle) {
    langToggle.querySelectorAll('[data-lang-opt]').forEach((opt) => {
      opt.classList.toggle('is-active', opt.dataset.langOpt === lang);
    });
  }

  if (scrollTopBtn) scrollTopBtn.setAttribute('aria-label', dict.aria_scroll_top);
  if (floatingCallBtn) floatingCallBtn.setAttribute('aria-label', dict.btn_call);
  if (floatingViberBtn) floatingViberBtn.setAttribute('aria-label', dict.btn_viber);

  if (heroViberBtn) {
    heroViberBtn.href = viberLink(dict.viber_hero_text);
  }

  const isShopPage = document.body.dataset.page === 'shop';
  document.title = isShopPage ? dict.shop_meta_title : dict.meta_title;
  const description = isShopPage ? dict.shop_meta_description : dict.meta_description;
  if (metaDescriptionEl) metaDescriptionEl.setAttribute('content', description);
  if (ogDescriptionEl) ogDescriptionEl.setAttribute('content', description);

  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

if (langToggle) {
  langToggle.addEventListener('click', (event) => {
    const opt = event.target.closest('[data-lang-opt]');
    if (!opt) return;
    applyLanguage(opt.dataset.langOpt);
  });
}

const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
applyLanguage(savedLang === 'ru' ? 'ru' : 'uk');

// Швидка заявка -> Viber
const quickForm = document.getElementById('quickForm');

if (quickForm) {
  quickForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const dict = translations[currentLang];

    const name = document.getElementById('qfName').value.trim();
    const phone = document.getElementById('qfPhone').value.trim();
    const msg = document.getElementById('qfMsg').value.trim();

    const lines = [
      dict.viber_form_greeting,
      `${dict.viber_form_name_label}: ${name}`,
      `${dict.viber_form_phone_label}: ${phone}`,
    ];
    if (msg) lines.push(`${dict.viber_form_comment_label}: ${msg}`);

    // Примітка: Viber офіційно не гарантує підстановку тексту в чат за посиланням
    // (на відміну від wa.me у WhatsApp) — параметр text спрацює не в усіх версіях додатку,
    // але чат з номером відкриється в будь-якому разі.
    window.location.href = viberLink(lines.join('\n'));

    quickForm.reset();
  });
}

// ===== Реальні відгуки з Google Places =====
// Ключ обмежений по HTTP-referrer в Google Cloud Console (тільки для
// tarabanov1070-sudo.github.io), тож використати його з іншого сайту не вийде.
const GOOGLE_PLACE_ID = 'ChIJ20WOTrv820AR9yE9OfrHrKs';
const GOOGLE_PLACES_KEY = 'AIzaSyDA5v0rfHde1C9lsSvDAe91wJMr0hLKWsA';

function reviewInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0].toUpperCase());
  return letters.join('') || '?';
}

function starString(rating) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

function renderReviewCards(reviews) {
  const grid = document.getElementById('reviewsGrid');
  if (!grid || !reviews.length) return;

  grid.innerHTML = reviews
    .slice(0, 5)
    .map((review, i) => {
      const text = (review.originalText && review.originalText.text) || (review.text && review.text.text) || '';
      const name = review.authorAttribution ? review.authorAttribution.displayName : '';
      const avatarClass = i % 2 ? 'review__avatar review__avatar--dark' : 'review__avatar';
      return `
        <div class="review">
          <span class="review__quote">”</span>
          <div class="review__stars">${starString(review.rating)}</div>
          <p>«${text}»</p>
          <div class="review__footer">
            <span class="${avatarClass}">${reviewInitials(name)}</span>
            <div class="review__author">${name}</div>
          </div>
        </div>`;
    })
    .join('');
}

async function loadGoogleReviews() {
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_KEY,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount',
      },
    });
    if (!res.ok) throw new Error(`places api HTTP ${res.status}`);

    const data = await res.json();
    if (!data.reviews || !data.reviews.length) throw new Error('no reviews in response');

    renderReviewCards(data.reviews);

    if (data.rating) reviewStats.rating = data.rating;
    if (data.userRatingCount) reviewStats.count = data.userRatingCount;
    renderReviewsNote(translations[currentLang]);
  } catch (err) {
    // Живий запит не вдався (блокувальник реклами, ліміт, офлайн тощо) —
    // лишаємо статичні (але справжні) відгуки, які вже є в HTML.
    console.warn('Google Places reviews: fallback to static reviews —', err);
  }
}

if (document.getElementById('reviewsGrid')) loadGoogleReviews();
