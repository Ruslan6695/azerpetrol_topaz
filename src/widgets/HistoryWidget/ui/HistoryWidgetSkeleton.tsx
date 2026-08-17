import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../shared'
import { Skeleton } from '../../../shared/Skeleton'

const ROWS = 5
// Высота строки списка: 12 + 12 паддингов + заголовок 13 и дата 11 с отступом
const ROW_HEIGHT = 58

// Скелетон повторяет новую раскладку: два поля периода → кольцо 160
// с легендой → группа строк.
export const HistoryWidgetSkeleton = memo(() => {
    const fieldWidth = SIZES.WIDTH(0.5) - 25 * SIZES.PX

    const styles = StyleSheet.create({
        dates: {
            flexDirection: 'row',
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
        chart: {
            alignItems: 'center',
            marginTop: SPACING.MD * SIZES.PX,
            gap: SPACING.XL * SIZES.PX,
        },
        legend: {
            gap: SPACING.ROW_GAP * SIZES.PX,
            width: '100%',
        },
        list: {
            marginTop: SPACING.XXL * SIZES.PX,
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <View>
            <View style={styles.dates}>
                <Skeleton
                    width={fieldWidth}
                    height={44 * SIZES.PX}
                    style={{ borderRadius: RADII.BADGE * SIZES.PX }}
                />
                <Skeleton
                    width={fieldWidth}
                    height={44 * SIZES.PX}
                    style={{ borderRadius: RADII.BADGE * SIZES.PX }}
                />
            </View>

            <View style={styles.chart}>
                <Skeleton
                    width={160 * SIZES.PX}
                    height={160 * SIZES.PX}
                    style={{ borderRadius: 80 * SIZES.PX }}
                />
                <View style={styles.legend}>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                            height={16 * SIZES.PX}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.list}>
                {Array.from({ length: ROWS }).map((_, index) => (
                    <Skeleton
                        key={index}
                        width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                        height={ROW_HEIGHT * SIZES.PX}
                        style={{ borderRadius: RADII.ROW * SIZES.PX }}
                    />
                ))}
            </View>
        </View>
    )
})
