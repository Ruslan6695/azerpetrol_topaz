import { memo, useCallback, useEffect, useState } from 'react'
import { CoffeeBonusWidget } from '../../../widgets/Coffee/CoffeeBonusWidget'
import { CoffeeMachinesStore } from '../../../features/Coffee/SelectCoffeeMachine'
import { SelectCoffeeMachineWidget } from '../../../widgets/Coffee/SelectCoffeeMachineWidget'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'

type Props = {
    coffeeMachineId?: string
}

export const CoffeeBonus = memo(({ coffeeMachineId }: Props) => {
    const getCoffeeMachines = CoffeeMachinesStore.useGetCoffeeMachines()
    const coffeeMachinesLoading = CoffeeMachinesStore.useIsLoading()
    const coffeeMachinesError = CoffeeMachinesStore.useError()
    const [selectedCoffeeMachineId, setSelectedCoffeeMachineId] = useState<
        number | null
    >(null)

    const handleChangeSelectedCoffeeMachineId = useCallback((id: number) => {
        setSelectedCoffeeMachineId(id)
    }, [])

    const fetchCoffeeMachines = async () => {
        const resp = await getCoffeeMachines()
        if (resp.coffee_machines.length === 1) {
            setSelectedCoffeeMachineId(resp.coffee_machines[0].id)
        }
    }

    useEffect(() => {
        if (coffeeMachineId) {
            setSelectedCoffeeMachineId(+coffeeMachineId)
        } else {
            fetchCoffeeMachines()
        }
    }, [coffeeMachineId])
    if (coffeeMachinesError) {
        return (
            <ErrorWhileFetchingForm
                margins={{ mt: 100 }}
                onReload={fetchCoffeeMachines}
                message={coffeeMachinesError}
            />
        )
    }
    if (!selectedCoffeeMachineId && !coffeeMachinesLoading) {
        return (
            <SelectCoffeeMachineWidget
                onSelectCoffeeMachineId={handleChangeSelectedCoffeeMachineId}
            />
        )
    }
    return (
        <CoffeeBonusWidget
            selectedCoffeeMachineId={Number(selectedCoffeeMachineId)}
        />
    )
})
