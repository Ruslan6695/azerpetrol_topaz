import { useRouter } from 'expo-router'
import { memo, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import {
    ESCREENS,
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    formatNewsDate,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'
import { INewsItem } from '../config/interfaces/INewsItem'

interface IProps extends INewsItem {}

// Карточка новости для горизонтальной карусели главной (200px по макету).
// Вертикальный список экрана /news рисует NewsItem — он не менялся.
export const NewsCard = memo(({ date_create, header, html_text }: IProps) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate({
            pathname: ESCREENS.NEWS_DETAILS,
            params: { date_create, html_text, header },
        })
    }, [router, date_create, html_text, header])

    // В карусели дата без года — так в макете.
    const date = useMemo(
        () => formatNewsDate(date_create, false),
        [date_create]
    )

    const styles = StyleSheet.create({
        card: {
            width: 200 * SIZES.PX,
        },
        title: {
            lineHeight: 17.6 * SIZES.PX,
        },
    })

    return (
        <PressableScale onPress={handlePress} scaleTo={PRESS_SCALE.CARD}>
            <GlassCard
                variant="glass"
                radius={RADII.ROW}
                padding={SPACING.LG}
                style={styles.card}
            >
                <Typography type="caption10" color="secondary">
                    {date}
                </Typography>
                <Typography
                    type="label13"
                    marginsPaddings={{ mt: SPACING.XS }}
                    numberOfLines={3}
                    style={styles.title}
                >
                    {header}
                </Typography>
            </GlassCard>
        </PressableScale>
    )
})
