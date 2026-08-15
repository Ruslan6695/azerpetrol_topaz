import { memo } from 'react'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    ConfirmCoffeePurchase,
    TCoffeePurchaseType,
} from '../../../../features/Coffee/ConfirmCoffeePurchase'

type Props = {
    coffee: ICoffeeItem
    type: TCoffeePurchaseType
    coffeeMachineId: number
    onSuccess: () => void
    onGoBack: () => void
}

// Шаг подтверждения заказа (dc.html:615–623).
export const CoffeeConfirmWidget = memo(
    ({ coffee, type, coffeeMachineId, onSuccess, onGoBack }: Props) => {
        return (
            <>
                <StepHeader title="Подтверждение" onBack={onGoBack} />
                <ConfirmCoffeePurchase
                    coffee={coffee}
                    type={type}
                    coffeeMachineId={coffeeMachineId}
                    onSuccess={onSuccess}
                    onCancel={onGoBack}
                />
            </>
        )
    }
)
