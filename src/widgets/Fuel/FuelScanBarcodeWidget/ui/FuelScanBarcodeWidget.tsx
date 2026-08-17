import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    FuelStore,
    SIZES,
    SPACING,
    TFuelRoad,
    UserStore,
    useSendFetch,
} from '../../../../shared'
import { CameraScanner } from '../../../../shared/CameraScanner'
import { fuelScanBarcodeWidgetApi } from '../api/fuelScanBarcodeWidgetApi'
import { FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS } from '../config/constants/FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelRoad>>
}

// Шаг сканирования QR-кода с колонки. Возврат даёт StepHeader над кадром,
// отдельной кнопки «Вернуться назад» под камерой в макете нет.
export const FuelScanBarcodeWidget = memo(({ setRoad }: Props) => {
    const { sendFetch } = useSendFetch({
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

    const styles = StyleSheet.create({
        info: {
            gap: SPACING.ROW_GAP * SIZES.PX,
            marginTop: SPACING.XXL * SIZES.PX,
        },
    })

    return (
        <>
            <StepHeader title="Сканирование" onBack={handleGoBack} />
            <CameraScanner onScan={handleSubmit} />
            <View style={styles.info}>
                {FUEL_SCAN_BARCODE_WIDGET_INFO_TEXTS.map((info) => (
                    <InfoCard key={info.title} {...info} />
                ))}
            </View>
        </>
    )
})
