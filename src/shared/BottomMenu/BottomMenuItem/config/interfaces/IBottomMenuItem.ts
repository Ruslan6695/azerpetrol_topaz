import { TIconName } from '../../../../Icons'

export interface IBottomMenuItem {
    // Иконки набора «21 Век» нормализованы на currentColor, поэтому
    // отдельные *_active и *_dark файлы больше не нужны — цвет приходит пропом.
    name: TIconName
    link: string
    title: string
}
