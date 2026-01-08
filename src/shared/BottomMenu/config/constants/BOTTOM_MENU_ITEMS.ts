import { EColorThemes } from '../../../common/config/enums/EColorThemes'
import { ESCREENS } from '../../../common/config/enums/EScreens'
import { IBottomMenuItem } from '../../BottomMenuItem'
import BalanceSvg from '../../assets/balance.svg'
import BalanceActiveSvg from '../../assets/balance_active.svg'
import BalanceDarkSvg from '../../assets/balance_dark.svg'
import BalanceDarkActiveSvg from '../../assets/balance_dark_active.svg'
import CoffeeSvg from '../../assets/coffee.svg'
import CoffeeActiveSvg from '../../assets/coffee_active.svg'

import CoffeeDarkSvg from '../../assets/coffee_dark.svg'
import CoffeeDarkActiveSvg from '../../assets/coffee_dark_active.svg'
import FuelSvg from '../../assets/fuel.svg'
import FuelActiveSvg from '../../assets/fuel_active.svg'
import FuelDarkSvg from '../../assets/fuel_dark.svg'
import FuelDarkActiveSvg from '../../assets/fuel_dark_active.svg'
import HomeSvg from '../../assets/home.svg'
import HomeActiveSvg from '../../assets/home_active.svg'
import HomeDarkSvg from '../../assets/home_dark.svg'
import HomeDarkActiveSvg from '../../assets/home_dark_active.svg'
import ProfileSvg from '../../assets/profile.svg'
import ProfileActiveSvg from '../../assets/profile_active.svg'
import ProfileDarkSvg from '../../assets/profile_dark.svg'
import ProfileDarkActiveSvg from '../../assets/profile_dark_active.svg'
export const BOTTOM_MENU_ITEMS = (
    colorTheme: EColorThemes
): IBottomMenuItem[] => {
    switch (colorTheme) {
        case EColorThemes.LIGHT:
            return [
                {
                    icon: FuelSvg,
                    link: ESCREENS.FUEL,
                    title: 'Топливо',
                    activeIcon: FuelActiveSvg,
                },
                {
                    icon: BalanceSvg,
                    link: ESCREENS.BALANCE,
                    title: 'Баланс',
                    activeIcon: BalanceActiveSvg,
                },

                {
                    icon: HomeSvg,
                    link: ESCREENS.HOME,
                    activeIcon: HomeActiveSvg,
                    title: 'Главная',
                },
                {
                    icon: CoffeeSvg,
                    link: ESCREENS.COFFEE,
                    title: 'Кофе',
                    activeIcon: CoffeeActiveSvg,
                },
                {
                    icon: ProfileSvg,
                    link: ESCREENS.PROFILE,
                    title: 'Профиль',
                    activeIcon: ProfileActiveSvg,
                },
            ]
        case EColorThemes.DARK:
            return [
                {
                    icon: FuelDarkSvg,
                    link: ESCREENS.FUEL,
                    title: 'Топливо',
                    activeIcon: FuelDarkActiveSvg,
                },
                {
                    icon: BalanceDarkSvg,
                    link: ESCREENS.BALANCE,
                    title: 'Баланс',
                    activeIcon: BalanceDarkActiveSvg,
                },

                {
                    icon: HomeDarkSvg,
                    link: ESCREENS.HOME,
                    activeIcon: HomeDarkActiveSvg,
                    title: 'Главная',
                },
                {
                    icon: CoffeeDarkSvg,
                    link: ESCREENS.COFFEE,
                    title: 'Кофе',
                    activeIcon: CoffeeDarkActiveSvg,
                },
                {
                    icon: ProfileDarkSvg,
                    link: ESCREENS.PROFILE,
                    title: 'Профиль',
                    activeIcon: ProfileDarkActiveSvg,
                },
            ]
    }
    return []
}
