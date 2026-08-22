import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING, divideNumber } from '../../../../shared'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { Typography } from '../../../../shared/Typography'

type Props = {
    color: string
    label: string
    value: number
}

// Легенды у пончика в макете нет (dc.html:299–301) — там три безымянных
// сектора. Пять типов операций без подписей не читаются, поэтому под кольцом
// идёт компактная легенда: точка цвета сегмента, подпись, сумма.
export const HistoryChartLegendItem = memo(({ color, label, value }: Props) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.SM * SIZES.PX,
        },
        dot: {
            width: 8 * SIZES.PX,
            height: 8 * SIZES.PX,
            borderRadius: RADII.PILL,
            backgroundColor: color,
        },
        label: {
            flex: 1,
        },
        value: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    })

    return (
        <View style={styles.container}>
            <View style={styles.dot} />
            <View style={styles.label}>
                <Typography type="body13" color="secondary">
                    {label}
                </Typography>
            </View>
            <View style={styles.value}>
                <Typography type="label13">{divideNumber(value)}</Typography>
                <BonusIcon mt={2} size={11} />
            </View>
        </View>
    )
})
