import { COLORS } from '../../../shared'

// Цвет операции по знаку суммы: зачисления — STATE.Positive, списания —
// STATE.Destructive (dc.html:305, 316). В макете он приходит полем данных,
// в приложении это функция от суммы — и в списке, и в деталях.
//
// Палитра приходит параметром: значения STATE в обеих темах совпадают,
// но брать их напрямую из модуля значило бы обойти ThemeStore.
export function getHistorySignColor(
    sum: number,
    palette: typeof COLORS
): string {
    return sum > 0 ? palette.STATE.Positive : palette.STATE.Destructive
}
