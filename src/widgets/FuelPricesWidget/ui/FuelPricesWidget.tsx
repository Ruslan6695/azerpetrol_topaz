import { memo, useCallback } from 'react'
import { MapFuelPricesPriceBlocks } from '../../../features/FuelPrices/MapFuelPricesPriceBlocks'
import { useFetchData } from '../../../shared'
import { fuelPricesWidgetApi } from '../api/fuelPricesWidgetApi'
import { useFocusEffect } from 'expo-router'
import { ShowFuelPricesInfo } from '../../../features/FuelPrices/ShowFuelPricesInfo'
import { Loader } from '../../../shared/Loader'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'

type Props = {}

export const FuelPricesWidget = (props: Props) => {
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
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
    if (errorText) {
        return (
            <ErrorWhileFetchingForm message={errorText} onReload={reloadData} />
        )
    }
    if (isDataLoading) {
        return <Loader marginsPaddings={{ mt: 100 }} />
    }
    return (
        <>
            {data && (
                <>
                    <MapFuelPricesPriceBlocks fuelPrices={data?.prices} />
                    {data.info ? <ShowFuelPricesInfo info={data.info} /> : null}
                </>
            )}
        </>
    )
}
