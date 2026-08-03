import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { HomeQuickTile } from '../../../../entities/Home/HomeQuickTile'
import { ESCREENS } from '../../../../shared'

type Props = {
    big_text?: string
    small_text?: string
}

export const OpenFuelPricesScreen = memo(({ big_text, small_text }: Props) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.FUEL_PRICES)
    }, [router])

    return (
        // Заголовок и подпись приходят с бэка: big_text сверху, small_text снизу.
        // Константа — фолбэк на случай, если текста для блока нет.
        <HomeQuickTile
            icon="home_prices"
            title={big_text || 'Цены'}
            subtitle={small_text}
            onPress={handlePress}
        />
    )
})
