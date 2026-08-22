import { useFocusEffect } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { InfoCard } from '../../../../entities/InfoCard'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { StepHeader } from '../../../../entities/StepHeader'
import { MapCoffeeItems } from '../../../../features/Coffee/MapCoffeeItems'
import { OpenCoffeeBonusScreenFromCoffee } from '../../../../features/Coffee/OpenCoffeeBonusScreen'
import { ScanCoffeeMachineButton } from '../../../../features/Coffee/ScanCoffeeMachine'
import { SelectCoffeeMachineButton } from '../../../../features/Coffee/SelectCoffeeMachine'
import {
    SIZES,
    SPACING,
    TCoffeeRoad,
    UserStore,
    useFetchData,
} from '../../../../shared'
import { buyCoffeeWidgetApi } from '../api/buyCoffeeWidgetApi'
import { BUY_COFFEE_WIDGET_INFO_TEXTS } from '../config/constants/BUY_COFFEE_WIDGET_INFO_TEXTS'

type Props = {
    road: Extract<TCoffeeRoad, 'main' | 'menu'>
    setRoad: React.Dispatch<React.SetStateAction<TCoffeeRoad>>
    onSelectCoffee: (coffee: ICoffeeItem) => void
}

// Вкладка «Купить»: и стартовый экран с выбором кофемашины, и меню напитков.
// Оба шага живут в одном виджете, потому что питаются одним запросом
// coffee/get_list/ — он же отдаёт счётчик бесплатных кофе для лаймовой карточки.
export const BuyCoffeeWidget = memo(
    ({ road, setRoad, onSelectCoffee }: Props) => {
        const setBalance = UserStore.useSetBalance()
        const { data, errorText, fetchData, isDataLoading } = useFetchData({
            apiCallback: buyCoffeeWidgetApi.getCoffee,
            errorText: 'Произошла ошибка при загрузке кофе',
        })

        const handleReloadData = useCallback(() => {
            fetchData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({
                        balance: data.balance,
                        bonus_balance: data.bonus_balance,
                    })
                },
            })
        }, [])

        const handleScan = useCallback(() => {
            setRoad('scan')
        }, [setRoad])

        const handleSelect = useCallback(() => {
            setRoad('select')
        }, [setRoad])

        const handleGoBack = useCallback(() => {
            setRoad('main')
        }, [setRoad])

        useFocusEffect(
            useCallback(() => {
                handleReloadData()
            }, [])
        )

        const styles = StyleSheet.create({
            container: {
                gap: SPACING.MD * SIZES.PX,
            },
            info: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                marginTop: SPACING.XXL * SIZES.PX,
            },
        })

        if (errorText) {
            return (
                <ErrorWhileFetchingForm
                    message={errorText}
                    onReload={handleReloadData}
                />
            )
        }

        // Лаймовая карточка нужна на обоих шагах: при единственной кофемашине
        // стартовый экран пропускается, и на нём её бы никто не увидел.
        const bonusCard =
            data?.bonus && data.bonus > 0 ? (
                <OpenCoffeeBonusScreenFromCoffee count={data.bonus} />
            ) : null

        if (road === 'menu') {
            return (
                <>
                    <StepHeader title="Меню кофе" onBack={handleGoBack} />
                    <View style={styles.container}>
                        {bonusCard}
                        <ScreenTitle title="Выберите напиток" ml={SPACING.XS} />
                        <MapCoffeeItems
                            onBuyCoffee={onSelectCoffee}
                            isItemsLoading={isDataLoading}
                            items={data?.coffee}
                        />
                    </View>
                </>
            )
        }

        return (
            <View style={styles.container}>
                {bonusCard}
                <ScanCoffeeMachineButton onPress={handleScan} />
                <SelectCoffeeMachineButton onPress={handleSelect} />
                <View style={styles.info}>
                    {BUY_COFFEE_WIDGET_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </View>
        )
    }
)
