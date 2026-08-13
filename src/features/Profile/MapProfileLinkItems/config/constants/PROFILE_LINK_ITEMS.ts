import { ESCREENS } from '../../../../../shared'
import { IProfileLinkItem } from '../interfaces/IProfileLinkItem'

// Порядок пунктов — из макета «21 Век», экран Профиля.
export const PROFILE_LINK_ITEMS: IProfileLinkItem[] = [
    { link: ESCREENS.HISTORY, title: 'История операций' },
    { link: ESCREENS.NEWS, title: 'Новости компании' },
    { link: ESCREENS.ABOUT_APP, title: 'О приложении' },
    { link: ESCREENS.ABOUT_COMPANY, title: 'О компании' },
    { link: ESCREENS.SETTINGS, title: 'Настройки' },
    { link: ESCREENS.HELP, title: 'Помощь' },
]
