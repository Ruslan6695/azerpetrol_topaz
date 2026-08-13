import moment from 'moment'

// Месяцы в родительном падеже задаём сами, чтобы не тащить moment/locale/ru
// в бандл ради одной строки.
const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
]

// Форматы, в которых бэкенд может отдать date_create. Контракт не
// задокументирован, поэтому перебираем известные и не угадываем дальше.
const FORMATS = [
    'DD.MM.YYYY',
    'DD.MM.YYYY HH:mm',
    'DD.MM.YYYY HH:mm:ss',
    'YYYY-MM-DD',
    'YYYY-MM-DD HH:mm',
    'YYYY-MM-DD HH:mm:ss',
    moment.ISO_8601,
]

/**
 * Дата новости в виде «15 июля 2026» (в карусели главной — без года).
 * Если строка не разбирается ни одним из известных форматов, возвращаем её
 * как есть: лучше сырое значение бэка, чем «Invalid date» на экране.
 */
export const formatNewsDate = (raw?: string, withYear = true): string => {
    if (!raw) {
        return ''
    }

    const parsed = moment(raw, FORMATS as string[], true)
    if (!parsed.isValid()) {
        return raw
    }

    const day = parsed.date()
    const month = MONTHS[parsed.month()]

    return withYear ? `${day} ${month} ${parsed.year()}` : `${day} ${month}`
}
