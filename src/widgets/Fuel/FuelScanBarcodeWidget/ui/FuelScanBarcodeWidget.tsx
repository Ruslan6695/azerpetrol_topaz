import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import {
    FuelStore,
    SIZES,
    TFuelRoad,
    UserStore,
    useSendFetch,
} from '../../../../shared'
import { CameraScanner } from '../../../../shared/CameraScanner'
import { CustomButton } from '../../../../shared/CustomButton'
import { Typography } from '../../../../shared/Typography'
import { fuelScanBarcodeWidgetApi } from '../api/fuelScanBarcodeWidgetApi'
import { FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

export const FuelScanBarcodeWidget = memo(({ setRoad }: Props) => {
    const { errorText, isSendFetchLoading, sendFetch } = useSendFetch({
        apiCallback: fuelScanBarcodeWidgetApi.scan,
        errorText: 'Ошибка при определении колонки',
    })
    const changeColumn = FuelStore.useChangeColumn()
    const changeAzs = FuelStore.useChangeAzs()
    const setBalance = UserStore.useSetBalance()

    const handleSubmit = useCallback(
        (code: string) => {
            sendFetch({
                args: { code },
                afterDataCallback(data) {
                    changeColumn(data.trc)
                    changeAzs(data.azs)
                    setBalance({
                        balance: data.balance,
                        bonus_balance: data.bonus_balance,
                    })
                    setRoad('selectTrkType')
                },
            })
        },
        [sendFetch, changeColumn, changeAzs, setBalance, setRoad]
    )

    const handleGoBack = useCallback(() => {
        setRoad('main')
    }, [setRoad])
    return (
        <>
            <View style={styles.container}>
                <Typography
                    type="bodyAccentMedium"
                    marginsPaddings={{ mb: 10 }}
                >
                    Просканируйте QR-код с колонки
                </Typography>
                <View style={styles.cameraContainer}>
                    <CameraScanner onScan={handleSubmit} />
                </View>

                <CustomButton
                    onPress={handleGoBack}
                    styled={{
                        type: 'secondary',
                        width: { type: 'absolute', value: '100%' },
                        marginsPaddings: { mt: 30 },
                    }}
                >
                    Вернуться назад
                </CustomButton>
            </View>
            <MapInfoBlocks infoBlocks={FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS} />
        </>
    )
})

const styles = StyleSheet.create({
    cameraContainer: {
        width: SIZES.WIDTH(0.8),
        height: SIZES.HEIGHT(0.4),
    },
    container: {
        alignItems: 'center',
    },
})
