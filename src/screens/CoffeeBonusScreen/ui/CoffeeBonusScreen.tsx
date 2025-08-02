import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { CoffeeBonusWidget } from '../../../widgets/Coffee/CoffeeBonusWidget'
import { useLocalSearchParams } from 'expo-router'
import { TCoffeeBonusScreenParams } from '../../../shared'
import { CoffeeBonus } from '../../../proccesses/CoffeeBonus'

type Props = {}

export const CoffeeBonusScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TCoffeeBonusScreenParams>()

    return (
        <InternalPagesLayout>
            <CoffeeBonus coffeeMachineId={params.coffee_machine_id} />
        </InternalPagesLayout>
    )
})
