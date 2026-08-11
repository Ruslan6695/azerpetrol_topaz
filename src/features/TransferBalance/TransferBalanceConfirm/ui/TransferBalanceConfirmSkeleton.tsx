import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

type Props = {}

const ROWS_COUNT = 4
// Отступы ListRow, чтобы полосы шиммера встали на место будущих строк.
const ROW_PADDING_VERTICAL = 15
const ROW_PADDING_HORIZONTAL = 18
const LINE_HEIGHT = 20

// Живёт внутри ListGroup, поэтому своей подложки не рисует —
// стекло и радиус приходят от группы.
export const TransferBalanceConfirmSkeleton = memo((props: Props) => {
    // Ширина строки: экран минус paddingHorizontal 20 у InternalPagesLayout
    // с двух сторон и минус собственные отступы строки.
    const width = SIZES.WIDTH(1) - (40 + ROW_PADDING_HORIZONTAL * 2) * SIZES.PX

    const styles = StyleSheet.create({
        row: {
            paddingVertical: ROW_PADDING_VERTICAL * SIZES.PX,
            paddingHorizontal: ROW_PADDING_HORIZONTAL * SIZES.PX,
        },
    })

    return (
        <>
            {Array.from({ length: ROWS_COUNT }).map((_, index) => (
                <View key={index} style={styles.row}>
                    <Skeleton
                        width={width}
                        height={LINE_HEIGHT * SIZES.PX}
                        style={{ borderRadius: RADII.CHIP_SM * SIZES.PX }}
                    />
                </View>
            ))}
        </>
    )
})
