import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../shared'
import { Skeleton } from '../../../shared/Skeleton'

type Props = {}

// Высота строки цены: бейдж 42 + paddingVertical 16×2.
const ROW_HEIGHT = 74
const ROWS_COUNT = 4
// Карточка info: label14 + body13 с отступом + padding 16×2.
const INFO_HEIGHT = 92

export const FuelPricesWidgetSkeleton = memo((props: Props) => {
    // Ширина контента внутри InternalPagesLayout: экран минус его
    // paddingHorizontal 20 с двух сторон.
    const width = SIZES.WIDTH(1) - 40 * SIZES.PX

    const styles = StyleSheet.create({
        list: {
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <View>
            <View style={styles.list}>
                {Array.from({ length: ROWS_COUNT }).map((_, index) => (
                    <Skeleton
                        key={index}
                        width={width}
                        height={ROW_HEIGHT * SIZES.PX}
                        style={{ borderRadius: RADII.ROW * SIZES.PX }}
                    />
                ))}
            </View>
            <Skeleton
                margins={{ mt: SPACING.SECTION }}
                width={width}
                height={INFO_HEIGHT * SIZES.PX}
                style={{ borderRadius: RADII.CARD * SIZES.PX }}
            />
        </View>
    )
})
