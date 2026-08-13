const ENTITIES: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&laquo;': '«',
    '&raquo;': '»',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
}

/**
 * Плоский текст из HTML — для превью новости в карточке списка: бэкенд
 * отдаёт только html_text, отдельного поля анонса в API нет.
 * Не парсер, а срезание разметки: годится ровно для превью в пару строк.
 */
export const stripHtml = (html?: string): string => {
    if (!html) {
        return ''
    }

    return (
        html
            .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
            .replace(/<[^>]+>/g, '')
            // Числовые сущности встречаются в кириллице из CMS (&#1055;) —
            // их разворачиваем, именованные берём из карты выше.
            .replace(/&#(\d+);/g, (_, code) =>
                String.fromCodePoint(Number(code))
            )
            .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
                String.fromCodePoint(parseInt(code, 16))
            )
            .replace(
                /&[a-z]+;/gi,
                (entity) => ENTITIES[entity.toLowerCase()] ?? ' '
            )
            .replace(/\s+/g, ' ')
            .trim()
    )
}
