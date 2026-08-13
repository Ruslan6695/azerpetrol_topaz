import { useRouter } from 'expo-router'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Image, LayoutChangeEvent, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { TPromotionsAndBonusesScreenParams } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import {
    ESCREENS,
    PRESS_SCALE,
    RADII,
    SCREENS_TITLES,
    SIZES,
    SPACING,
    ThemeStore,
    formatNewsDate,
    getToken,
} from '../../../shared'
import { Glass, GlassCard } from '../../../shared/GlassCard'
import { HtmlContent } from '../../../shared/HtmlContent'
import { PressableScale } from '../../../shared/PressableScale'
import { Typography } from '../../../shared/Typography'

type Props = {
    params: Partial<TPromotionsAndBonusesScreenParams>
}

const BACK_SIZE = 38
const CARD_PADDING = 18
// Баннер акции часто состоит из текста, поэтому вписываем его целиком
// (contain), а не кадрируем.
const HERO_HEIGHT = 180
// Тот же заголовок, что показала бы шапка экрана, — в ветке page_link она
// скрыта, и строку берём из общего справочника, а не пишем руками.
const TITLE = SCREENS_TITLES[ESCREENS.PROMOTIONS_AND_BONUSES_DETAILS]

// Детальной акции в макете «21 Век» нет — экран собран из соседних паттернов:
// шапка push-экрана, заголовок акции, карточка «О компании».
export const PromotionsAndBonusesDetailsWidget = memo(({ params }: Props) => {
    const router = useRouter()
    const COLORS = ThemeStore.useCOLORS()
    const theme = ThemeStore.useTheme()
    const insets = useSafeAreaInsets()
    const [token, setToken] = useState<null | string>(null)
    // Высота собственной шапки: WebView не растёт по контенту, ему нужна явная
    // высота, а вычитать magic numbers чужого хедера нельзя.
    const [headerHeight, setHeaderHeight] = useState(0)

    // Акция может быть отдельной страницей на бэке — тогда вместо html_text
    // показываем её во WebView, а экран идёт без шапки и паддингов layout'а.
    const isExternalPage = !!params.page_link

    useEffect(() => {
        if (!isExternalPage) {
            return
        }
        getToken().then(setToken)
    }, [isExternalPage])

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const handleHeaderLayout = useCallback((event: LayoutChangeEvent) => {
        setHeaderHeight(event.nativeEvent.layout.height)
    }, [])

    // Страница акции сама просит закрыть экран — других сообщений она не шлёт.
    const handleWebViewMessage = useCallback(
        (event: WebViewMessageEvent) => {
            if (event.nativeEvent.data === 'goBack') {
                router.back()
            }
        },
        [router]
    )

    const date = useMemo(
        () => formatNewsDate(params.date_create),
        [params.date_create]
    )

    // Страница акции получает токен и текущую тему приложения (dark | light),
    // чтобы подстроить под неё свой дизайн. Разделитель считаем: в page_link
    // с бэка уже может быть свой query. Смена темы меняет ссылку и страница
    // перезагружается — это и нужно, чтобы она перерисовалась.
    const pageUri = useMemo(() => {
        if (!params.page_link || !token) {
            return null
        }
        const separator = params.page_link.includes('?') ? '&' : '?'
        return `${params.page_link}${separator}token=${token}&theme=${theme}`
    }, [params.page_link, token, theme])

    const styles = useMemo(
        () =>
            StyleSheet.create({
                // Шапка нужна только ветке page_link: обычная детальная берёт
                // её у InternalPagesLayout. Экран с page_link идёт без
                // паддингов, поэтому отбиваемся от края и от выреза сами.
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: SPACING.MD * SIZES.PX,
                    paddingTop: insets.top + 10 * SIZES.PX,
                    paddingBottom: SPACING.MD * SIZES.PX,
                    paddingHorizontal: SPACING.SCREEN * SIZES.PX,
                },
                back: {
                    width: BACK_SIZE * SIZES.PX,
                    height: BACK_SIZE * SIZES.PX,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                webViewBox: {
                    height: SIZES.HEIGHT(1) - headerHeight,
                    width: SIZES.WIDTH(1),
                },
                hero: {
                    height: HERO_HEIGHT * SIZES.PX,
                    borderRadius: RADII.CARD * SIZES.PX,
                    overflow: 'hidden',
                    marginTop: SPACING.XL * SIZES.PX,
                },
                heroImg: {
                    width: '100%',
                    height: '100%',
                },
                body: {
                    marginTop: SPACING.XL * SIZES.PX,
                },
            }),
        [insets.top, headerHeight]
    )

    if (isExternalPage) {
        return (
            <>
                <View style={styles.header} onLayout={handleHeaderLayout}>
                    <PressableScale
                        onPress={handleBack}
                        scaleTo={PRESS_SCALE.BACK}
                    >
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

                    <Typography type="num18">{TITLE}</Typography>
                </View>

                <View style={styles.webViewBox}>
                    {/* Токен читается из хранилища асинхронно: до него грузить
                        страницу нечем — она открывается по ?token= */}
                    {!!pageUri && (
                        <WebView
                            onMessage={handleWebViewMessage}
                            focusable={false}
                            showsVerticalScrollIndicator={false}
                            source={{ uri: pageUri }}
                        />
                    )}
                </View>
            </>
        )
    }

    return (
        <>
            <Typography type="caption12" color="secondary">
                {date}
            </Typography>
            <Typography type="num20" marginsPaddings={{ mt: SPACING.XS }}>
                {params.header}
            </Typography>

            {!!params.img && (
                <View style={styles.hero}>
                    <Image
                        style={styles.heroImg}
                        source={{ uri: params.img }}
                        resizeMode="contain"
                    />
                </View>
            )}

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
