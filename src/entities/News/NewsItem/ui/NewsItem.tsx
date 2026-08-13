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
    stripHtml,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'
import { INewsItem } from '../config/interfaces/INewsItem'

interface IProps extends INewsItem {}

// Карточка вертикального списка экрана /news (по макету r24, padding 18).
// Горизонтальная карусель главной рисует NewsCard — она компактнее.
const CARD_PADDING = 18

export const NewsItem = memo(({ date_create, header, html_text }: IProps) => {
    const router = useRouter()

    const handlePress = useCallback(() => {
        router.navigate({
            pathname: ESCREENS.NEWS_DETAILS,
            params: { date_create, html_text, header },
        })
    }, [router, date_create, html_text, header])

    // Превью бэкенд не отдаёт — снимаем разметку с полного текста новости.
    const preview = useMemo(() => stripHtml(html_text), [html_text])
    const date = useMemo(() => formatNewsDate(date_create), [date_create])

    const styles = useMemo(
        () =>
            StyleSheet.create({
                title: {
                    lineHeight: 20.8 * SIZES.PX,
                },
                preview: {
                    lineHeight: 17 * SIZES.PX,
                },
            }),
        []
    )

    return (
        <PressableScale onPress={handlePress} scaleTo={PRESS_SCALE.CARD}>
            <GlassCard
                variant="glass2"
                radius={RADII.CARD}
                padding={CARD_PADDING}
            >
                <Typography type="caption11" color="secondary">
                    {date}
                </Typography>
                <Typography
                    type="label16"
                    marginsPaddings={{ mt: SPACING.XS }}
                    numberOfLines={2}
                    style={styles.title}
                >
                    {header}
                </Typography>
                {!!preview && (
                    <Typography
                        type="body125"
                        color="secondary"
                        marginsPaddings={{ mt: SPACING.XS }}
                        numberOfLines={2}
                        style={styles.preview}
                    >
                        {preview}
                    </Typography>
                )}
            </GlassCard>
        </PressableScale>
    )
})
