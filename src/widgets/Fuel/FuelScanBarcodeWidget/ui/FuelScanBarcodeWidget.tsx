import { memo, useCallback } from 'react'
import { CameraScanner } from '../../../../shared/CameraScanner'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { CustomButton } from '../../../../shared/CustomButton'
import { FuelStore, SIZES, UserStore, useSendFetch } from '../../../../shared'
import { fuelScanBarcodeWidgetApi } from '../api/fuelScanBarcodeWidgetApi'
import { MapInfoBlocks } from '../../../../features/MapInfoBlocks'
import { FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<
        React.SetStateAction<
            | 'main'
            | 'selectAzsAndColumn'
            | 'scan'
            | 'selectTrkType'
            | 'selectLiters'
        >
    >
}

export const FuelScanBarcodeWidget = memo(({ setRoad }: Props) => {
    const { errorText, isSendFetchLoading, sendFetch } = useSendFetch({
        apiCallback: fuelScanBarcodeWidgetApi.scan,
        errorText: 'Ошибка при определении колонки',
    })
    const changeColumn = FuelStore.useChangeColumn()
    const changeAzs = FuelStore.useChangeAzs()
    const setBalance = UserStore.useSetBalance()

    const handleSubmit = useCallback((code: string) => {
        sendFetch({
            args: { code },
            afterDataCallback(data) {
                changeColumn(data.trc)
                changeAzs(data.azs)
                setBalance({ balance: data.balance })
                setRoad('selectTrkType')
            },
            onErrorCallback(error) {},
        })
    }, [])
    const onGoBack = useCallback(() => {
        setRoad('main')
    }, [])
    return (
        <>
            <View style={styles.container}>
                <CustomText fw="600" fz={20} marginsPaddings={{ mb: 10 }}>
                    Просканируйте QR-код с колонки
                </CustomText>
                <View style={styles.cameraContainer}>
                    <CameraScanner onScan={handleSubmit} />
                </View>

                <CustomButton
                    onPress={onGoBack}
                    styled={{
                        type: 'OUTLINED',
                        width: { type: 'absolute', value: '100%' },
                        marginsPaddings: { mt: 20 },
                    }}
                >
                    ВЕРНУТЬСЯ НАЗАД
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
