import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { DonutChart } from '../../../../shared/DonutChart'
import { Typography } from '../../../../shared/Typography'

// Пустой период. Кольцо остаётся на месте пустым треком, чтобы блок
// не прыгал по высоте при смене периода; растровой заглушки blured.png
// и белой плашки поверх неё больше нет — в тёмной теме они были сломаны.
export const GetHistoryPieChartWithoutData = memo(() => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            paddingVertical: 6 * SIZES.PX,
        },
        center: {
            alignItems: 'center',
            paddingHorizontal: 12 * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <DonutChart segments={[]}>
                <View style={styles.center}>
                    <Typography
                        type="caption11"
                        color="secondary"
                        textAlign="center"
                    >
                        Нет данных за период
                    </Typography>
                </View>
            </DonutChart>
        </View>
    )
})
