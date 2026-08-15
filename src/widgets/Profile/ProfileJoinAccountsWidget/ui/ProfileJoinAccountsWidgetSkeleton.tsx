import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Skeleton } from '../../../../shared/Skeleton'

// Повторяет геометрию карточки: заголовок → лента плиток → строка-ссылка.
// Один прямоугольник фиксированной высоты давал скачок у пользователей
// без связанных аккаунтов.
const CARD_PADDING_HORIZONTAL = 18
const TITLE_WIDTH = 160
const TITLE_HEIGHT = 15
const TILE_WIDTH = 100
const TILE_HEIGHT = 86
const TILES_COUNT = 2
const LINK_WIDTH = 170
const LINK_HEIGHT = 13

// Ни один размер здесь не зависит от темы — стили живут вне тела компонента,
// чтобы не пересобираться на каждый кадр шиммера.
const styles = StyleSheet.create({
    tiles: {
        flexDirection: 'row',
        gap: SPACING.ROW_GAP * SIZES.PX,
        marginTop: SPACING.MD * SIZES.PX,
    },
    bar: {
        borderRadius: RADII.CHIP_SM * SIZES.PX,
    },
    tile: {
        borderRadius: RADII.INPUT * SIZES.PX,
    },
})

export const ProfileJoinAccountsWidgetSkeleton = memo(() => {
    return (
        <GlassCard
            variant="glass"
            radius={RADII.CARD}
            paddingVertical={SPACING.XL}
            paddingHorizontal={CARD_PADDING_HORIZONTAL}
        >
            <Skeleton
                width={TITLE_WIDTH * SIZES.PX}
                height={TITLE_HEIGHT * SIZES.PX}
                style={styles.bar}
            />

            <View style={styles.tiles}>
                {Array.from({ length: TILES_COUNT }).map((_, index) => (
                    <Skeleton
                        key={index}
                        width={TILE_WIDTH * SIZES.PX}
                        height={TILE_HEIGHT * SIZES.PX}
                        style={styles.tile}
                    />
                ))}
            </View>

            <Skeleton
                width={LINK_WIDTH * SIZES.PX}
                height={LINK_HEIGHT * SIZES.PX}
                style={styles.bar}
                margins={{ mt: SPACING.MD }}
            />
        </GlassCard>
    )
})
