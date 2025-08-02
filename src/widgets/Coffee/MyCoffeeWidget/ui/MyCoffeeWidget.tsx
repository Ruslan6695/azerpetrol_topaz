import { memo, useCallback, useEffect, useState } from 'react'
import { MyCoffeeQr } from '../../../../entities/Coffee/MyCoffeeQr'
import { StyleSheet, View } from 'react-native'
import { MapMyCoffeeItems } from '../../../../features/Coffee/MapMyCoffeeItems'
import { myCoffeeWidgetApi } from '../api/myCoffeeWidgetApi'
import { useFetchData } from '../../../../shared'
import { IMyCoffeeItem } from '../../../../entities/Coffee/MyCoffeeItem'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'

type Props = {}

export const MyCoffeeWidget = memo((props: Props) => {
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: myCoffeeWidgetApi.getCoffee,
        errorText: 'Ошибка при получении кофе',
    })
    const [selectedCoffee, setSelectedCoffee] = useState<IMyCoffeeItem>()

    const handleChangeSelectedCoffee = useCallback((coffee: IMyCoffeeItem) => {
        setSelectedCoffee(coffee)
    }, [])

    const handleReloadData = useCallback(() => {
        fetchData({
            args: undefined,
            afterDataCallback(data) {
                if (data.coffee.length > 0) {
                    setSelectedCoffee(data.coffee[0])
                }
            },
            hideToastOnError: true,
        })
    }, [])

    useEffect(() => {
        handleReloadData()
    }, [])

    if (errorText) {
        return (
            <ErrorWhileFetchingForm
                margins={{ mt: 100 }}
                onReload={handleReloadData}
                message={errorText}
            />
        )
    }
    return (
        <View style={styles.container}>
            <MyCoffeeQr qr={selectedCoffee?.qr} />
            
                <MapMyCoffeeItems
                    selectedCoffeeId={selectedCoffee?.id}
                    onChangeSelectedCoffee={handleChangeSelectedCoffee}
                    coffee={data?.coffee}
                />
            
        </View>
    )
})

const styles = StyleSheet.create({
    container: {},
})
