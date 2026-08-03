import { SvgProps } from 'react-native-svg'
import BonusSvg from '../../assets/bonus.svg'
import CoffeeScanSvg from '../../assets/coffee_scan.svg'
import CoffeeSelectSvg from '../../assets/coffee_select.svg'
import ContactsSvg from '../../assets/contacts.svg'
import ConvertSvg from '../../assets/convert.svg'
import EyeSvg from '../../assets/eye.svg'
import EyeOffSvg from '../../assets/eye_off.svg'
import FuelHelpSvg from '../../assets/fuel_help.svg'
import FuelScanSvg from '../../assets/fuel_scan.svg'
import FuelSelectSvg from '../../assets/fuel_select.svg'
import GiftSvg from '../../assets/gift.svg'
import HomeBonusesSvg from '../../assets/home_bonuses.svg'
import HomeCoffeeSvg from '../../assets/home_coffee.svg'
import HomeHistorySvg from '../../assets/home_history.svg'
import HomePricesSvg from '../../assets/home_prices.svg'
import LocationSvg from '../../assets/location.svg'
import MoonSvg from '../../assets/moon.svg'
import PersonSvg from '../../assets/person.svg'
import PhoneSvg from '../../assets/phone.svg'
import PlusSvg from '../../assets/plus.svg'
import ProfileDeleteAccSvg from '../../assets/profile_delete_acc.svg'
import SmsSvg from '../../assets/sms.svg'
import SunSvg from '../../assets/sun.svg'
import TabBalanceSvg from '../../assets/tab_balance.svg'
import TabCoffeeSvg from '../../assets/tab_coffee.svg'
import TabFuelSvg from '../../assets/tab_fuel.svg'
import TabHomeSvg from '../../assets/tab_home.svg'
import TabProfileSvg from '../../assets/tab_profile.svg'
import WalletSvg from '../../assets/wallet.svg'

// Набор иконок макета «21 Век». Все нормализованы на currentColor,
// поэтому красятся одним пропом color у <Icon>, без *_dark-дубликатов.
export const ICONS = {
    bonus: BonusSvg,
    coffee_scan: CoffeeScanSvg,
    coffee_select: CoffeeSelectSvg,
    contacts: ContactsSvg,
    convert: ConvertSvg,
    eye: EyeSvg,
    eye_off: EyeOffSvg,
    fuel_help: FuelHelpSvg,
    fuel_scan: FuelScanSvg,
    fuel_select: FuelSelectSvg,
    gift: GiftSvg,
    home_bonuses: HomeBonusesSvg,
    home_coffee: HomeCoffeeSvg,
    home_history: HomeHistorySvg,
    home_prices: HomePricesSvg,
    location: LocationSvg,
    moon: MoonSvg,
    person: PersonSvg,
    phone: PhoneSvg,
    plus: PlusSvg,
    profile_delete_acc: ProfileDeleteAccSvg,
    sms: SmsSvg,
    sun: SunSvg,
    tab_balance: TabBalanceSvg,
    tab_coffee: TabCoffeeSvg,
    tab_fuel: TabFuelSvg,
    tab_home: TabHomeSvg,
    tab_profile: TabProfileSvg,
    wallet: WalletSvg,
} satisfies Record<string, React.FC<SvgProps>>
