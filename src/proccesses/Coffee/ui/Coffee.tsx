import { useFocusEffect } from 'expo-router'
import { memo, useCallback, useEffect, useState } from 'react'
import { ICoffeeItem } from '../../../entities/Coffee/CoffeeItem'
import { CoffeeSuccess } from '../../../entities/Coffee/CoffeeSuccess'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { CoffeeMachinesStore } from '../../../features/Coffee/SelectCoffeeMachine'
import { SPACING, TCoffeeRoad, TCoffeeScreenParams } from '../../../shared'
import {
    TabBarWithBackground,
    useTabBar,
} from '../../../shared/TabBarWithBackground'
import { BuyCoffeeWidget } from '../../../widgets/Coffee/BuyCoffeeWidget'
import { CoffeeConfirmWidget } from '../../../widgets/Coffee/CoffeeConfirmWidget'
import { MyCoffeeWidget } from '../../../widgets/Coffee/MyCoffeeWidget'
import { ScanCoffeeMachineWidget } from '../../../widgets/Coffee/ScanCoffeeMachineWidget'
import { SelectCoffeeMachineWidget } from '../../../widgets/Coffee/SelectCoffeeMachineWidget'

type Props = {
    params: Partial<TCoffeeScreenParams>
}

// Порядок вкладок — из макета (dc.html:203–206), но открывается экран
// на «Купить»: покупка чаще, чем показ уже купленного QR.
const TAB_MY = 1
const TAB_BUY = 2
const MY_TAB = { label: 'Мой кофе', value: TAB_MY }
const BUY_TAB = { label: 'Купить', value: TAB_BUY }
const TABS = [MY_TAB, BUY_TAB]

export const Coffee = memo(({ params }: Props) => {
    const getCoffeeMachines = CoffeeMachinesStore.useGetCoffeeMachines()
    const coffeeMachinesError = CoffeeMachinesStore.useError()
    const { handleChangeSelectedTab, selectedTab } = useTabBar(BUY_TAB)

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
        setRoad('main')
        handleChangeSelectedTab(MY_TAB)
    }, [handleChangeSelectedTab])

    const fetchCoffeeMachines = useCallback(async () => {
        const resp = await getCoffeeMachines()
        // Единственную кофемашину выбирать не за что — сразу открываем меню.
        if (resp.coffee_machines.length === 1) {
            setSelectedCoffeeMachineId(resp.coffee_machines[0].id)
            setRoad((current) => (current === 'main' ? 'menu' : current))
        }
    }, [getCoffeeMachines])

    useEffect(() => {
        if (params.road === 'muy') {
            handleChangeSelectedTab(MY_TAB)
        }
    }, [params.road])

    useFocusEffect(
        useCallback(() => {
            fetchCoffeeMachines()
        }, [])
    )

    if (coffeeMachinesError && road === 'main') {
        return (
            <ErrorWhileFetchingForm
                onReload={fetchCoffeeMachines}
                message={coffeeMachinesError}
            />
        )
    }

    const isMyTab = selectedTab?.value === TAB_MY
    // Шаги сценария покупки занимают экран целиком: в макете это push-экраны
    // со своей шапкой, сегмент-контрола на них нет.
    const isTabBarVisible = isMyTab || road === 'main'

    const renderBuyRoad = () => {
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
                        type="buy"
                        coffeeMachineId={Number(selectedCoffeeMachineId)}
                        onSuccess={handleBought}
                        onGoBack={handleGoToMenu}
                    />
                ) : null
            case 'success':
                return <CoffeeSuccess onGoToMyCoffee={handleGoToMyCoffee} />
            default:
                return (
                    <BuyCoffeeWidget
                        road={road}
                        setRoad={setRoad}
                        onSelectCoffee={handleSelectCoffee}
                    />
                )
        }
    }

    return (
        <>
            {isTabBarVisible && (
                <TabBarWithBackground
                    styled={{
                        width: { type: 'absolute', value: '100%' },
                        marginsPaddings: { mb: SPACING.SCREEN },
                    }}
                    onChangeSelectedTab={handleChangeSelectedTab}
                    selectedTab={selectedTab}
                    tabs={TABS}
                />
            )}
            {isMyTab ? <MyCoffeeWidget /> : renderBuyRoad()}
        </>
    )
})
