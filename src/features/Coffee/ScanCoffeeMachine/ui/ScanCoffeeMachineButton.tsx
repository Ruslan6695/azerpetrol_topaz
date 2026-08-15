import { memo } from 'react'
import { CoffeeMethodCard } from '../../../../entities/Coffee/CoffeeMethodCard'

type Props = {
    onPress: () => void
}

export const ScanCoffeeMachineButton = memo(({ onPress }: Props) => {
    return (
        <CoffeeMethodCard
            icon="coffee_scan"
            title="Сканировать кофемашину"
            subtitle="QR-код на кофемашине"
            onPress={onPress}
        />
    )
})
