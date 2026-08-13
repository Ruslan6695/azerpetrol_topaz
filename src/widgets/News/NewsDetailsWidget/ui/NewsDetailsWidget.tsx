import { useRouter } from 'expo-router'
import { memo, useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { TNewsDetailsScreenParams } from '../../../../entities/News/NewsItem'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    formatNewsDate,
} from '../../../../shared'
import { Glass, GlassCard } from '../../../../shared/GlassCard'
import { HtmlContent } from '../../../../shared/HtmlContent'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'

type Props = {
    params: Partial<TNewsDetailsScreenParams>
}

const BACK_SIZE = 38
const CARD_PADDING = 18

// Детальной новости в макете «21 Век» нет — экран собран из соседних
// паттернов: шапка push-экрана, заголовок акции, карточка «О компании».
export const NewsDetailsWidget = memo(({ params }: Props) => {
    const router = useRouter()
    const COLORS = ThemeStore.useCOLORS()

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const date = useMemo(
        () => formatNewsDate(params.date_create),
        [params.date_create]
    )

    const styles = useMemo(
        () =>
            StyleSheet.create({
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SPACING.MD * SIZES.PX,
                    marginBottom: SPACING.XL * SIZES.PX,
                },
                back: {
                    width: BACK_SIZE * SIZES.PX,
                    height: BACK_SIZE * SIZES.PX,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                body: {
                    marginTop: SPACING.XL * SIZES.PX,
                },
            }),
        []
    )

    return (
        <>
            {/* Экран живёт в группе (main), где шапка — логотип и кошелёк,
                поэтому «назад» собираем в самом контенте. */}
            <View style={styles.header}>
                <PressableScale onPress={handleBack} scaleTo={PRESS_SCALE.BACK}>
                    <Glass
                        level="secondary"
                        radius={(BACK_SIZE / 2) * SIZES.PX}
                    >
                        <View style={styles.back}>
                            <Typography
                                type="num16"
                                customColor={COLORS.TEXT.Primary}
                            >
                                ←
                            </Typography>
                        </View>
                    </Glass>
                </PressableScale>

                <Typography type="num18">Новости</Typography>
            </View>

            <Typography type="caption12" color="secondary">
                {date}
            </Typography>
            <Typography type="num20" marginsPaddings={{ mt: SPACING.XS }}>
                {params.header}
            </Typography>

            {!!params.html_text && (
                <GlassCard
                    variant="glass2"
                    radius={RADII.CARD}
                    padding={CARD_PADDING}
                    style={styles.body}
                >
                    <HtmlContent html={params.html_text} />
                </GlassCard>
            )}
        </>
    )
})
