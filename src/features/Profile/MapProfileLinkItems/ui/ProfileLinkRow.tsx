import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ListRow } from '../../../../shared/ListRow'
import { IProfileLinkItem } from '../config/interfaces/IProfileLinkItem'

interface IProps extends IProfileLinkItem {
    last?: boolean
}

// Отдельный компонент строки, чтобы обработчик перехода жил в useCallback,
// а не пересоздавался лямбдой на каждый рендер списка.
export const ProfileLinkRow = memo(({ title, link, last }: IProps) => {
    const router = useRouter()

    const handlePress = useCallback(() => {
        router.navigate(link)
    }, [router, link])

    return (
        <ListRow
            title={title}
            right="chevron"
            last={last}
            onPress={handlePress}
        />
    )
})
