import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { ICoffeeItem } from '../../../entities/Coffee/CoffeeItem'
import { CoffeeSuccess } from '../../../entities/Coffee/CoffeeSuccess'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { CoffeeMachinesStore } from '../../../features/Coffee/SelectCoffeeMachine'
import { ESCREENS, TCoffeeRoad } from '../../../shared'
import { CoffeeBonusWidget } from '../../../widgets/Coffee/CoffeeBonusWidget'
import { CoffeeConfirmWidget } from '../../../widgets/Coffee/CoffeeConfirmWidget'
import { ScanCoffeeMachineWidget } from '../../../widgets/Coffee/ScanCoffeeMachineWidget'
import { SelectCoffeeMachineWidget } from '../../../widgets/Coffee/SelectCoffeeMachineWidget'

type Props = {
    coffeeMachineId?: string
}

// Тот же сценарий, что и на вкладке «Купить», но без вкладок и с бесплатными
// напитками. Возврат в «Мой кофе» идёт через роут — экран push-овый.
export const CoffeeBonus = memo(({ coffeeMachineId }: Props) => {
    const router = useRouter()
    const getCoffeeMachines = CoffeeMachinesStore.useGetCoffeeMachines()
    const coffeeMachinesError = CoffeeMachinesStore.useError()

    const [road, setRoad] = useState<TCoffeeRoad>('main')
    const [selectedCoffeeMachineId, setSelectedCoffeeMachineId] = useState<
        number | null
    >(null)
    const [selectedCoffee, setSelectedCoffee] = useState<ICoffeeItem>()

    const handleSelectCoffeeMachineId = useCallback((id: number) => {
        setSelectedCoffeeMachineId(id)
        setRoad('menu')
    }, [])

    const handleSelectCoffee = useCallback((coffee: ICoffeeItem) => {
        setSelectedCoffee(coffee)
        setRoad('confirm')
    }, [])

    const handleGoToMain = useCallback(() => {
        setRoad('main')
    }, [])

    const handleGoToMenu = useCallback(() => {
        setRoad('menu')
    }, [])

    const handleBought = useCallback(() => {
        setRoad('success')
    }, [])

    const handleGoToMyCoffee = useCallback(() => {
        router.navigate({
            pathname: ESCREENS.COFFEE,
            params: { road: 'muy' },
        })
    }, [router])

    const fetchCoffeeMachines = useCallback(async () => {
        const resp = await getCoffeeMachines()
        if (resp.coffee_machines.length === 1) {
            setSelectedCoffeeMachineId(resp.coffee_machines[0].id)
            setRoad((current) => (current === 'main' ? 'menu' : current))
        }
    }, [getCoffeeMachines])

    useEffect(() => {
        // Кофемашина могла приехать в параметрах маршрута — тогда список не нужен.
        if (coffeeMachineId) {
            setSelectedCoffeeMachineId(+coffeeMachineId)
            setRoad('menu')
        } else {
            fetchCoffeeMachines()
        }
    }, [coffeeMachineId])

    if (coffeeMachinesError && road === 'main') {
        return (
            <ErrorWhileFetchingForm
                margins={{ mt: 100 }}
                onReload={fetchCoffeeMachines}
                message={coffeeMachinesError}
            />
        )
    }

    switch (road) {
        case 'scan':
            return (
                <ScanCoffeeMachineWidget
                    onSelectCoffeeMachineId={handleSelectCoffeeMachineId}
                    onGoBack={handleGoToMain}
                />
            )
        case 'select':
            return (
                <SelectCoffeeMachineWidget
                    onSelectCoffeeMachineId={handleSelectCoffeeMachineId}
                    onGoBack={handleGoToMain}
                    onReload={fetchCoffeeMachines}
                />
            )
        case 'confirm':
            return selectedCoffee ? (
                <CoffeeConfirmWidget
                    coffee={selectedCoffee}
                    type="bonus"
                    coffeeMachineId={Number(selectedCoffeeMachineId)}
                    onSuccess={handleBought}
                    onGoBack={handleGoToMenu}
                />
            ) : null
        case 'success':
            return <CoffeeSuccess onGoToMyCoffee={handleGoToMyCoffee} />
        default:
            return (
                <CoffeeBonusWidget
                    road={road}
                    setRoad={setRoad}
                    onSelectCoffee={handleSelectCoffee}
                />
            )
    }
})
