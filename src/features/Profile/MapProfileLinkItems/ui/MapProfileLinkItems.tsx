import { memo, useMemo } from 'react'
import {
    IProfileLinkItem,
    ProfileLinkItem,
} from '../../../../entities/Profile/ProfileLinkItem'
import { ESCREENS } from '../../../../shared'
import AboutAppSvg from '../assets/about_app.svg'
import AboutCompanySvg from '../assets/about_company.svg'
import HistorySvg from '../assets/history.svg'
import NewsSvg from '../assets/news.svg'
import SettingsSvg from '../assets/settings.svg'
import SupportSvg from '../assets/support.svg'
import DeleteAccSvg from '../assets/delete_acc.svg'
type Props = {
    onDeleteAccount: () => void
}

const items: IProfileLinkItem[] = [
    { icon: HistorySvg, link: ESCREENS.HISTORY, title: 'История операций' },
    { icon: NewsSvg, link: ESCREENS.NEWS, title: 'Новости компании' },
    { icon: AboutAppSvg, link: ESCREENS.ABOUT_APP, title: 'О приложении' },
    {
        icon: AboutCompanySvg,
        link: ESCREENS.ABOUT_COMPANY,
        title: 'О компании',
    },
    { icon: DeleteAccSvg, link: ESCREENS.SETTINGS, title: 'Удаление аккаунта' },
    { icon: SupportSvg, link: ESCREENS.HELP, title: 'Помощь' },
]
export const MapProfileLinkItems = memo(({ onDeleteAccount }: Props) => {
    const items = useMemo<IProfileLinkItem[]>(() => {
        return [
            {
                icon: HistorySvg,
                link: ESCREENS.HISTORY,
                title: 'История операций',
            },
            { icon: NewsSvg, link: ESCREENS.NEWS, title: 'Новости компании' },
            {
                icon: AboutAppSvg,
                link: ESCREENS.ABOUT_APP,
                title: 'О приложении',
            },
            {
                icon: AboutCompanySvg,
                link: ESCREENS.ABOUT_COMPANY,
                title: 'О компании',
            },
            {
                icon: DeleteAccSvg,
                link: ESCREENS.SETTINGS,
                title: 'Удаление аккаунта',
                onPress: onDeleteAccount,
            },
            { icon: SupportSvg, link: ESCREENS.HELP, title: 'Помощь' },
        ]
    }, [onDeleteAccount])

    return (
        <>
            {items.map((item) => (
                <ProfileLinkItem {...item} key={item.link} />
            ))}
        </>
    )
})
