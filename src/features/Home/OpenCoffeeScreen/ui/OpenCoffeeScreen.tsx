import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { HomeQuickTile } from '../../../../entities/Home/HomeQuickTile'
import { ESCREENS } from '../../../../shared'

type Props = {
    big_text?: string
    small_text?: string
}

export const OpenCoffeeScreen = memo(({ big_text, small_text }: Props) => {
    const router = useRouter()
    // Кофе — вкладка таб-бара, поэтому navigate, а не push: иначе на табе
    // появится «назад», которой в макете нет.
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.COFFEE)
    }, [router])

    return (
        <HomeQuickTile
            icon="home_coffee"
            title="Купить кофе"
            subtitle={[small_text, big_text].filter(Boolean).join(' ')}
            onPress={handlePress}
        />
    )
})
