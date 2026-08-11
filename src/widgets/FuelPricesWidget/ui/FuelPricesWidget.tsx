import { useFocusEffect } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { FuelPriceRow } from '../../../entities/Fuel/FuelPriceRow'
import { InfoCard } from '../../../entities/InfoCard'
import { SIZES, SPACING, useFetchData } from '../../../shared'
import { CenteredState } from '../../../shared/CenteredState'
import { MPLayout } from '../../../shared/MpLayout'
import { fuelPricesWidgetApi } from '../api/fuelPricesWidgetApi'
import { IFuelPricesWidgetData } from '../config/interfaces/IFuelPricesWidgetData'
import { FuelPricesWidgetSkeleton } from './FuelPricesWidgetSkeleton'

type Props = {}

export const FuelPricesWidget = memo((props: Props) => {
    const { data, errorText, fetchData, isDataLoading } =
        useFetchData<IFuelPricesWidgetData>({
            apiCallback: fuelPricesWidgetApi.getPrices,
            errorText: 'Ошибка при получении данных',
        })

    useFocusEffect(
        useCallback(() => {
            fetchData({ args: undefined, hideToastOnError: true })
        }, [])
    )

    const reloadData = useCallback(() => {
        fetchData({ args: undefined, hideToastOnError: true })
    }, [])

    const styles = StyleSheet.create({
        list: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    if (errorText) {
        return (
            <ErrorWhileFetchingForm message={errorText} onReload={reloadData} />
        )
    }

    // Данные перезапрашиваются на каждом фокусе экрана, поэтому скелетон
    // показываем только пока показывать нечего — иначе при возврате на экран
    // уже загруженные цены подменялись бы плашками.
    if (isDataLoading && !data) {
        return <FuelPricesWidgetSkeleton />
    }

    if (!data) {
        return null
    }

    if (!data.prices?.length) {
        return (
            <CenteredState
                variant="empty"
                title="Цены не загрузились"
                description="Попробуйте обновить экран позже."
                action={{ label: 'Обновить', onPress: reloadData }}
            />
        )
    }

    return (
        <>
            <View style={styles.list}>
                {data.prices.map((price) => (
                    <FuelPriceRow key={price.id} {...price} />
                ))}
            </View>
            {data.info ? (
                <MPLayout mt={SPACING.SECTION}>
                    <InfoCard {...data.info} />
                </MPLayout>
            ) : null}
        </>
    )
})
