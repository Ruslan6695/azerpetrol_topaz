import { useFocusEffect } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { InfoCard } from '../../../../entities/InfoCard'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { MapCoffeeItems } from '../../../../features/Coffee/MapCoffeeItems'
import { ScanCoffeeMachineButton } from '../../../../features/Coffee/ScanCoffeeMachine'
import { SelectCoffeeMachineButton } from '../../../../features/Coffee/SelectCoffeeMachine'
import { SIZES, SPACING, TCoffeeRoad, useFetchData } from '../../../../shared'
import { coffeeBonusWidgetApi } from '../api/coffeeBonusWidgetApi'
import { COFFEE_BONUS_WIDGET_INFO_TEXTS } from '../config/constants/COFFEE_BONUS_WIDGET_INFO_TEXTS'

type Props = {
    road: Extract<TCoffeeRoad, 'main' | 'menu'>
    setRoad: React.Dispatch<React.SetStateAction<TCoffeeRoad>>
    onSelectCoffee: (coffee: ICoffeeItem) => void
}

// Меню бесплатных напитков. Отдельный запрос с bonus: 1 отдаёт свой список,
// поэтому сценарий живёт отдельным роутом /coffee_bonus, а не вкладкой «Купить».
export const CoffeeBonusWidget = memo(
    ({ road, setRoad, onSelectCoffee }: Props) => {
        const { data, errorText, fetchData, isDataLoading } = useFetchData({
            apiCallback: coffeeBonusWidgetApi.getCoffee,
            errorText: 'Произошла ошибка при загрузке кофе',
        })

        const handleReloadData = useCallback(() => {
            fetchData({ args: undefined, hideToastOnError: true })
        }, [])

        const handleScan = useCallback(() => {
            setRoad('scan')
        }, [setRoad])

        const handleSelect = useCallback(() => {
            setRoad('select')
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
                    margins={{ mt: 100 }}
                    message={errorText}
                    onReload={handleReloadData}
                />
            )
        }

        if (road === 'main') {
            return (
                <View style={styles.container}>
                    <ScanCoffeeMachineButton onPress={handleScan} />
                    <SelectCoffeeMachineButton onPress={handleSelect} />
                    <View style={styles.info}>
                        {COFFEE_BONUS_WIDGET_INFO_TEXTS.map((info) => (
                            <InfoCard key={info.title} {...info} />
                        ))}
                    </View>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <ScreenTitle title="Выберите напиток" ml={SPACING.XS} />
                <MapCoffeeItems
                    bonus
                    onBuyCoffee={onSelectCoffee}
                    isItemsLoading={isDataLoading}
                    items={data?.coffee}
                />
            </View>
        )
    }
)
