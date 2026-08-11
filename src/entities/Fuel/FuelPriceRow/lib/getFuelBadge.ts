import { TFuelBadge } from '../config/types/TFuelBadge'

// Код марки и вид топлива для бейджа строки цены.
//
// В ответе get_fuel_prices/ есть только полное название («Бензин АИ-92»),
// а макет рисует в бейдже короткий код («АИ-92»). Поля code в API нет,
// поэтому код выводится здесь. Если бэкенд когда-нибудь начнёт отдавать
// code/kind, правится только этот файл.

// Дизель определяем и по слову, и по аббревиатуре — в прайсе встречается
// «Дизельное топливо», «ДТ Евро», «ДТ-Евро».
//
// Аббревиатура ищется как отдельное слово, но границу нельзя писать через \b:
// в JS \b строится на [A-Za-z0-9_], для кириллицы он не работает. Поэтому
// требуем, чтобы рядом с «дт» не стояло букв — пробел, дефис, край строки.
const DIESEL_RE = /(дизел|diesel|(^|[^А-Яа-яЁёA-Za-z])дт([^А-Яа-яЁёA-Za-z]|$))/i
// «АИ-92», «АИ 92», «АИ92», латинское «AI-95» — всё в один вид.
const OCTANE_RE = /(АИ|AI)[\s-]?(\d{2,3})/i

const FALLBACK_CODE_MAX_LENGTH = 6

export const getFuelBadge = (name: string): TFuelBadge => {
    const trimmed = name.trim()

    if (DIESEL_RE.test(trimmed)) {
        return { code: 'ДТ', isDiesel: true }
    }

    const octane = trimmed.match(OCTANE_RE)
    if (octane) {
        return { code: `АИ-${octane[2]}`, isDiesel: false }
    }

    // Незнакомая марка: берём первое слово и режем по ширине бейджа —
    // строка не должна ломаться из-за нового вида топлива.
    const firstWord = trimmed.split(/\s+/)[0] ?? ''
    return {
        code: firstWord.slice(0, FALLBACK_CODE_MAX_LENGTH),
        isDiesel: false,
    }
}
