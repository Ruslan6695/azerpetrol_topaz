import { memo, useCallback, useEffect, useState } from 'react'
import {
    TabBarWithBackground,
    useTabBar,
} from '../../../shared/TabBarWithBackground'
import { BuyCoffeeWidget } from '../../../widgets/Coffee/BuyCoffeeWidget'
import { MyCoffeeWidget } from '../../../widgets/Coffee/MyCoffeeWidget'
import {
    TCoffeeScreenParams,
    useFetchData,
    useFetchStoreData,
} from '../../../shared'
import { SelectCoffeeMachineWidget } from '../../../widgets/Coffee/SelectCoffeeMachineWidget'
import { useFocusEffect } from 'expo-router'
import { CoffeeMachinesStore } from '../../../features/Coffee/SelectCoffeeMachine'
import { CustomText } from '../../../shared/CustomText'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'

type Props = {
    params: Partial<TCoffeeScreenParams>
}

export const Coffee = memo(({ params }: Props) => {
    const getCoffeeMachines = CoffeeMachinesStore.useGetCoffeeMachines()
    const coffeeMachinesLoading = CoffeeMachinesStore.useIsLoading()
    const coffeeMachinesError = CoffeeMachinesStore.useError()
    const { handleChangeSelectedTab, selectedTab } = useTabBar({
        value: 1,
        label: 'КУПИТЬ КОФЕ',
    })
    const [selectedCoffeeMachineId, setSelectedCoffeeMachineId] = useState<
        number | null
    >(null)

    const handleBuyCoffee = useCallback(() => {
        handleChangeSelectedTab({ label: 'Мои кофе', value: 2 })
    }, [])

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
        if (params.road === 'muy') {
            handleChangeSelectedTab({ label: 'Мои кофе', value: 2 })
        }
    }, [params.road])

    useFocusEffect(
        useCallback(() => {
            fetchCoffeeMachines()
        }, [])
    )

    if (coffeeMachinesError) {
        return (
            <ErrorWhileFetchingForm
                margins={{ mt: 100 }}
                onReload={fetchCoffeeMachines}
                message={coffeeMachinesError}
            />
        )
    }

    return (
        <>
            <TabBarWithBackground
                styled={{
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mb: 20 },
                }}
                onChangeSelectedTab={handleChangeSelectedTab}
                selectedTab={selectedTab}
                tabs={[
                    { label: 'Купить кофе', value: 1 },
                    { label: 'Мои кофе', value: 2 },
                ]}
            />
            {selectedTab?.value === 1 ? (
                selectedCoffeeMachineId || coffeeMachinesLoading ? (
                    <BuyCoffeeWidget
                        selectedCoffeeMachineId={Number(
                            selectedCoffeeMachineId
                        )}
                        onBuyCoffee={handleBuyCoffee}
                    />
                ) : (
                    <SelectCoffeeMachineWidget
                        onSelectCoffeeMachineId={
                            handleChangeSelectedCoffeeMachineId
                        }
                    />
                )
            ) : (
                <MyCoffeeWidget />
            )}
        </>
    )
})
