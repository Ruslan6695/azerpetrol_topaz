import { ICONS } from '../config/constants/ICONS'
import { TIconName } from '../config/types/TIconName'

// Приводит имя иконки, пришедшее с бэка, к набору проекта.
//
// Без проверки любое незнакомое имя (опечатка, иконка из будущего релиза)
// дало бы ICONS[name] === undefined и краш рендера вместо пропущенной
// картинки — поэтому всё, чего нет в наборе, откатывается на fallback.
export function resolveIconName(
    name: string | undefined | null,
    fallback: TIconName
): TIconName {
    return name && name in ICONS ? (name as TIconName) : fallback
}
