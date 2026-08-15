import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../../entities/InfoCard'
import { StepHeader } from '../../../../entities/StepHeader'
import { ScanCoffeeMachine } from '../../../../features/Coffee/ScanCoffeeMachine'
import { SIZES, SPACING } from '../../../../shared'
import { SCAN_COFFEE_MACHINE_WIDGET_INFO_TEXTS } from '../config/constants/SCAN_COFFEE_MACHINE_WIDGET_INFO_TEXTS'

type Props = {
    onSelectCoffeeMachineId: (id: number) => void
    onGoBack: () => void
}

// QR кофемашины закодирован как coffee_machine_id=<id>.
const QR_KEY = 'coffee_machine_id'

// Шаг сканирования QR-кода с кофемашины.
export const ScanCoffeeMachineWidget = memo(
    ({ onSelectCoffeeMachineId, onGoBack }: Props) => {
        const handleScan = useCallback(
            (text: string) => {
                const [key, value] = text.split('=')
                if (key === QR_KEY && value) {
                    onSelectCoffeeMachineId(Number(value))
                }
            },
            [onSelectCoffeeMachineId]
        )

        const styles = StyleSheet.create({
            info: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                marginTop: SPACING.XXL * SIZES.PX,
            },
        })

        return (
            <>
                <StepHeader title="Сканирование" onBack={onGoBack} />
                <ScanCoffeeMachine onScan={handleScan} />
                <View style={styles.info}>
                    {SCAN_COFFEE_MACHINE_WIDGET_INFO_TEXTS.map((info) => (
                        <InfoCard key={info.title} {...info} />
                    ))}
                </View>
            </>
        )
    }
)
