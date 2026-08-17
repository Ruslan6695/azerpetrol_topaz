import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../shared'
import { Skeleton } from '../../../shared/Skeleton'

const ROWS = 4

// Скелетон повторяет раскладку деталей: пилюля → сумма → дата → группа строк.
export const HistoryDetailsWidgetSkeleton = memo(() => {
    const styles = StyleSheet.create({
        header: {
            alignItems: 'center',
            gap: SPACING.SM * SIZES.PX,
            paddingVertical: SPACING.SM * SIZES.PX,
            marginBottom: SPACING.LG * SIZES.PX,
        },
        group: {
            gap: SPACING.MD * SIZES.PX,
            padding: 18 * SIZES.PX,
        },
    })

    return (
        <View>
            <View style={styles.header}>
                <Skeleton width={160 * SIZES.PX} height={30 * SIZES.PX} />
                <Skeleton width={140 * SIZES.PX} height={36 * SIZES.PX} />
                <Skeleton width={110 * SIZES.PX} height={14 * SIZES.PX} />
            </View>

            <View style={styles.group}>
                {Array.from({ length: ROWS }).map((_, index) => (
                    <Skeleton
                        key={index}
                        width={SIZES.WIDTH(0.8)}
                        height={20 * SIZES.PX}
                        style={{ borderRadius: RADII.CHIP_SM * SIZES.PX }}
                    />
                ))}
            </View>
        </View>
    )
})
