import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { HomeQuickTile } from '../../../../entities/Home/HomeQuickTile'
import { ESCREENS } from '../../../../shared'

type Props = {
    big_text?: string
    small_text?: string
}

export const OpenPromotionAndBonusesScreen = memo(
    ({ big_text, small_text }: Props) => {
        const router = useRouter()
        const handlePress = useCallback(() => {
            router.navigate(ESCREENS.PROMOTIONS_AND_BONUSES)
        }, [router])

        return (
            <HomeQuickTile
                icon="home_bonuses"
                title="Акции"
                subtitle={[small_text, big_text].filter(Boolean).join(' ')}
                onPress={handlePress}
            />
        )
    }
)
