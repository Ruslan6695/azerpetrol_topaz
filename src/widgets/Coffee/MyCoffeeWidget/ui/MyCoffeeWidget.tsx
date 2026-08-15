import { memo, useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { IMyCoffeeItem } from '../../../../entities/Coffee/MyCoffeeItem'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { QrBlock } from '../../../../entities/QrBlock'
import { MapMyCoffeeItems } from '../../../../features/Coffee/MapMyCoffeeItems'
import { RADII, SIZES, SPACING, useFetchData } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'
import { myCoffeeWidgetApi } from '../api/myCoffeeWidgetApi'

// Размеры кофейного QR из макета (dc.html:210–218): карточка меньше
// балансной, сам код 150.
const QR_SIZE = 150
const QR_CARD_PADDING = 22

export const MyCoffeeWidget = memo(() => {
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

    const styles = StyleSheet.create({
        container: {
            gap: SPACING.SECTION * SIZES.PX,
        },
        qr: {
            alignItems: 'center',
            gap: SPACING.MD * SIZES.PX,
        },
        caption: {
            maxWidth: 260 * SIZES.PX,
        },
    })

    if (errorText) {
        return (
            <ErrorWhileFetchingForm
                margins={{ mt: 100 }}
                onReload={handleReloadData}
                message={errorText}
            />
        )
    }

    const hasCoffee = !data || data.coffee.length > 0

    return (
        <View style={styles.container}>
            {hasCoffee && (
                <View style={styles.qr}>
                    <QrBlock
                        qr={selectedCoffee?.qr}
                        qrIsLoading={isDataLoading}
                        qrSize={QR_SIZE}
                        radius={RADII.HERO_SM}
                        padding={QR_CARD_PADDING}
                    />
                    <Typography
                        type="caption12"
                        color="secondary"
                        textAlign="center"
                        style={styles.caption}
                    >
                        {selectedCoffee
                            ? `Покажите QR на кофемашине, чтобы налить «${selectedCoffee.name}»`
                            : 'Покажите QR на кофемашине, чтобы налить напиток'}
                    </Typography>
                </View>
            )}

            <MapMyCoffeeItems
                selectedCoffeeId={selectedCoffee?.id}
                onChangeSelectedCoffee={handleChangeSelectedCoffee}
                coffee={data?.coffee}
            />
        </View>
    )
})
