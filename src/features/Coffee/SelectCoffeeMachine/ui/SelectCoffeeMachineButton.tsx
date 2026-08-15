import { memo } from 'react'
import { CoffeeMethodCard } from '../../../../entities/Coffee/CoffeeMethodCard'

type Props = {
    onPress: () => void
}

export const SelectCoffeeMachineButton = memo(({ onPress }: Props) => {
    return (
        <CoffeeMethodCard
            icon="coffee_select"
            title="Выбрать из списка"
            subtitle="АЗС и кофемашина вручную"
            onPress={onPress}
        />
    )
})
