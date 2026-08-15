import { memo } from 'react'
import { CenteredState } from '../../../../shared/CenteredState'

type Props = {
    onGoToMyCoffee: () => void
}

// Финал кофейного сценария (dc.html:645–652): кольцо замыкается на вкладку
// «Мой кофе», где лежит QR только что купленного напитка.
export const CoffeeSuccess = memo(({ onGoToMyCoffee }: Props) => {
    return (
        <CenteredState
            variant="success"
            title="Готово!"
            description="Напиток появится во вкладке «Мой кофе». Баланс обновится в течение минуты."
            action={{
                label: 'Налить кофе',
                onPress: onGoToMyCoffee,
                variant: 'elevated',
            }}
        />
    )
})
