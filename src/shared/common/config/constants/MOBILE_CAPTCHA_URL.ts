// Страница с виджетом Yandex SmartCaptcha, которую грузит WebView в GetCaptcha.
// Сейчас указывает на страницу вендора-первоисточника (azscontrol.ru) — та же
// природа хардкода, что была раньше у send_error() в azerpetrol-topaz-server
// (см. adapters/secondary/database/pdo/connect.php): код скопирован из чужой
// платформы, домен скопировался вместе с ним. Site-key Yandex SmartCaptcha,
// встроенный в эту страницу, должен совпадать с серверным секретом
// TOPAZ_SMARTCAPTCHA_SERVER_KEY в conf/topaz.php — при клонировании под новую
// сеть АЗС оба значения меняются вместе: своя страница с капчей (свой
// site-key) здесь, свой секрет — на сервере.
export const MOBILE_CAPTCHA_URL = 'https://azscontrol.ru/mobile_captcha/'
