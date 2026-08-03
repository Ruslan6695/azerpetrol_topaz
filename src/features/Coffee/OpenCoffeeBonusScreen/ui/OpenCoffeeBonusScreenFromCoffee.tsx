import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { PromoRow } from '../../../../shared/PromoRow'

type Props = {
    count: number
}

export const OpenCoffeeBonusScreenFromCoffee = memo(({ count }: Props) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.COFFEE_BONUS)
    }, [router])

    return (
        <PromoRow
            icon="gift"
            label="Кофе в подарок"
            title={`${count} шт. — выберите любимый напиток`}
            onPress={handlePress}
        />
    )
})
