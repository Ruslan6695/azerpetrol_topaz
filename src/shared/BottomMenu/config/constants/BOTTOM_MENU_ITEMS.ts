import { ESCREENS } from '../../../common/config/enums/EScreens'
import { IBottomMenuItem } from '../../BottomMenuItem'

// Порядок из макета: Топливо, Баланс, Главная, Кофе, Профиль.
export const BOTTOM_MENU_ITEMS: IBottomMenuItem[] = [
    { name: 'tab_fuel', link: ESCREENS.FUEL, title: 'Топливо' },
    { name: 'tab_balance', link: ESCREENS.BALANCE, title: 'Баланс' },
    { name: 'tab_home', link: ESCREENS.HOME, title: 'Главная' },
    { name: 'tab_coffee', link: ESCREENS.COFFEE, title: 'Кофе' },
    { name: 'tab_profile', link: ESCREENS.PROFILE, title: 'Профиль' },
]
