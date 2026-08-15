import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { Skeleton } from '../../../../shared/Skeleton'

// Геометрия CenteredState: круг 96 → заголовок → описание → две пилюли.
const CIRCLE_SIZE = 96
const TITLE_WIDTH = 220
const TITLE_HEIGHT = 26
const DESCRIPTION_WIDTH = 140
const DESCRIPTION_HEIGHT = 18
const BUTTON_WIDTH = 200
const BUTTON_HEIGHT = 54
const VERTICAL_PADDING = 60

// Ни один размер здесь не зависит от темы — стили живут вне тела компонента,
// чтобы не пересобираться на каждый кадр шиммера.
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: SPACING.XL * SIZES.PX,
        paddingVertical: VERTICAL_PADDING * SIZES.PX,
    },
    actions: {
        alignItems: 'center',
        gap: SPACING.ROW_GAP * SIZES.PX,
        marginTop: SPACING.SM * SIZES.PX,
    },
    pill: {
        borderRadius: RADII.PILL,
    },
    bar: {
        borderRadius: RADII.CHIP_SM * SIZES.PX,
    },
})

export const AddJoinAccountConfirmSkeleton = memo(() => {
    return (
        <View style={styles.container}>
            <Skeleton
                width={CIRCLE_SIZE * SIZES.PX}
                height={CIRCLE_SIZE * SIZES.PX}
                style={styles.pill}
            />

            <Skeleton
                width={TITLE_WIDTH * SIZES.PX}
                height={TITLE_HEIGHT * SIZES.PX}
                style={styles.bar}
            />

            <Skeleton
                width={DESCRIPTION_WIDTH * SIZES.PX}
                height={DESCRIPTION_HEIGHT * SIZES.PX}
                style={styles.bar}
            />

            <View style={styles.actions}>
                <Skeleton
                    width={BUTTON_WIDTH * SIZES.PX}
                    height={BUTTON_HEIGHT * SIZES.PX}
                    style={styles.pill}
                />
                <Skeleton
                    width={BUTTON_WIDTH * SIZES.PX}
                    height={BUTTON_HEIGHT * SIZES.PX}
                    style={styles.pill}
                />
            </View>
        </View>
    )
})
