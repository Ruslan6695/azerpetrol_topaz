import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

type Props = {}

// Раскладка шиммеров повторяет главную: карточка баланса, герой, сетка 2×2.
export const HomeMainWidgetSkeleton = memo((props: Props) => {
    // Тот же floor, что и у HomeQuickTile, — иначе шиммеры лягут в столбик.
    const tileWidth = Math.floor(SIZES.WIDTH(0.5) - 26 * SIZES.PX)

    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <Skeleton
                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                height={170 * SIZES.PX}
                style={{ borderRadius: RADII.HERO_SM * SIZES.PX }}
            />
            <Skeleton
                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                height={104 * SIZES.PX}
                style={{ borderRadius: RADII.HERO_SM * SIZES.PX }}
            />
            <View style={styles.grid}>
                {[1, 2, 3, 4].map((id) => (
                    <Skeleton
                        key={id}
                        width={tileWidth}
                        height={118 * SIZES.PX}
                        style={{ borderRadius: RADII.CARD * SIZES.PX }}
                    />
                ))}
            </View>
        </View>
    )
})
