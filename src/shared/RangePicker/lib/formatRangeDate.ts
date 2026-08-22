// ISO-дата календаря (yyyy-mm-dd) → формат полей периода из макета (dd.mm.yyyy).
export function formatRangeDate(date: undefined | string): string {
    if (!date) {
        return ''
    }

    const [year, month, day] = date.split('-')

    if (!year || !month || !day) {
        return ''
    }

    return `${day}.${month}.${year}`
}
