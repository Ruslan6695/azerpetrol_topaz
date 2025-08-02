import { IBottomMenuItem } from '../../BottomMenuItem'
import HomeSvg from '../../assets/home.svg'
import QrSvg from '../../assets/qr.svg'
import QrGreenSvg from '../../assets/qr_green.svg'
import FuelSvg from '../../assets/fuel.svg'
import FuelGreenSvg from '../../assets/fuel_green.svg'
import ProductsSvg from '../../assets/products.svg'
import ProductsGreenSvg from '../../assets/products_green.svg'
import ProfileSvg from '../../assets/profile.svg'
import ProfileGreenSvg from '../../assets/profile_green.svg'
import CoffeeSvg from '../../assets/coffee.svg'
import CoffeeGreenSvg from '../../assets/coffee_green.svg'
import { ESCREENS } from '../../../common/config/enums/EScreens'

export const BOTTOM_MENU_ITEMS: IBottomMenuItem[] = [
    {
        icon: FuelSvg,
        link: ESCREENS.FUEL,
        title: 'Топливо',
        activeIcon: FuelGreenSvg,
    },
    {
        icon: QrSvg,
        link: ESCREENS.BALANCE,
        title: 'Баланс',
        activeIcon: QrGreenSvg,
    },

    {
        icon: HomeSvg,
        link: ESCREENS.HOME,
        activeIcon: HomeSvg,
    },
    {
        icon: CoffeeSvg,
        link: ESCREENS.COFFEE,
        title: 'Кофе',
        activeIcon: CoffeeGreenSvg,
    },
    {
        icon: ProfileSvg,
        link: ESCREENS.PROFILE,
        title: 'Профиль',
        activeIcon: ProfileGreenSvg,
    },
]
