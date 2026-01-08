import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { CoffeeBonus } from '../../../proccesses/CoffeeBonus'
import { useLocalSearchParams } from 'expo-router'
import { TCoffeeBonusScreenParams } from '../../../shared/common/config/types/routeParams/TCoffeeBonusScreenParams'

type Props = {}

export const CoffeeBonusScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TCoffeeBonusScreenParams>()

    return (
        <InternalPagesLayout>
            <CoffeeBonus coffeeMachineId={params.coffee_machine_id} />
        </InternalPagesLayout>
    )
})
