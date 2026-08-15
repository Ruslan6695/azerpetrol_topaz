import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING } from '../../../shared'
import { GlassCard } from '../../../shared/GlassCard'
import { Skeleton } from '../../../shared/Skeleton'
import { ARTICLE_CARD_PADDING } from '../config/constants/ARTICLE_CARD'

// Скелетона текстового контента в макете «21 Век» нет — собран из общего
// шиммера по образцу ProfileWidgetSkeleton: полоса-заголовок и несколько
// строк текста разной длины. Обёрнут в ту же карточку, что и готовая
// статья, чтобы при появлении контента рамка не прыгала.
const TITLE_HEIGHT = 20
const LINE_HEIGHT = 13
const TITLE_WIDTH_RATIO = 0.55
// Доли ширины строк: последняя короче — как обрыв абзаца.
const LINE_WIDTH_RATIOS = [1, 0.97, 0.92, 0.99, 0.94, 0.6]

export const GetArticleSkeleton = memo(() => {
    // Боковые отступы даёт InternalPagesLayout (SPACING.SCREEN с каждой
    // стороны), внутренние — сама карточка.
    const contentWidth =
        SIZES.WIDTH(1) -
        (SPACING.SCREEN * 2 + ARTICLE_CARD_PADDING * 2) * SIZES.PX

    const styles = useMemo(
        () =>
            StyleSheet.create({
                lines: {
                    gap: SPACING.MD * SIZES.PX,
                },
                bar: {
                    borderRadius: RADII.CHIP_SM * SIZES.PX,
                },
            }),
        []
    )

    return (
        <GlassCard
            variant="glass2"
            radius={RADII.CARD}
            padding={ARTICLE_CARD_PADDING}
        >
            <Skeleton
                width={contentWidth * TITLE_WIDTH_RATIO}
                height={TITLE_HEIGHT * SIZES.PX}
                style={styles.bar}
                margins={{ mb: SPACING.XL }}
            />

            <View style={styles.lines}>
                {LINE_WIDTH_RATIOS.map((ratio, index) => (
                    <Skeleton
                        key={index}
                        width={contentWidth * ratio}
                        height={LINE_HEIGHT * SIZES.PX}
                        style={styles.bar}
                    />
                ))}
            </View>
        </GlassCard>
    )
})
