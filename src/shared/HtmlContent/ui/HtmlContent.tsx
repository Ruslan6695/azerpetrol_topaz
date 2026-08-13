import { memo, useCallback, useMemo, useState } from 'react'
import {
    LayoutChangeEvent,
    Linking,
    Platform,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native'
import WebView, {
    WebViewMessageEvent,
    WebViewNavigation,
} from 'react-native-webview'
import { DOMEN } from '../../common/config/constants/DOMEN'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import {
    HEIGHT_REPORTER_SCRIPT,
    buildHtmlDocument,
} from '../lib/buildHtmlDocument'
import { HtmlFallback } from './HtmlFallback'

type Props = {
    /** Разметка от бэкенда как есть — оборачивается в документ с темой проекта */
    html: string
    /** База для относительных ссылок на картинки. По умолчанию — домен API */
    baseUrl?: string
    style?: StyleProp<ViewStyle>
}

// Высота скрытого WebView, пока он грузится: экрана хватает, чтобы документ
// разложился и отчитался о своей настоящей высоте.
const MEASURE_HEIGHT = SIZES.HEIGHT(1)

// Обёртка над react-native-webview для HTML, приходящего с бэкенда:
// в отличие от RenderHTML тут работают картинки, видео и встроенные плееры.
//
// Пока WebView грузится, на его месте виден нативный RenderHTML — текст новости
// появляется сразу. Подмена происходит по первой замеренной высоте документа:
// WebView сам по контенту не растёт, а вложенный скролл внутри экранного
// ScrollView недопустим.
export const HtmlContent = memo(({ html, baseUrl = DOMEN, style }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const isWebViewReady = height > 0

    const handleLayout = useCallback((event: LayoutChangeEvent) => {
        setWidth(event.nativeEvent.layout.width)
    }, [])

    const source = useMemo(
        () => ({
            html: buildHtmlDocument({ html, colors: COLORS }),
            baseUrl,
        }),
        [html, COLORS, baseUrl]
    )

    // Ссылки уводим в системный браузер: подменять содержимое карточки
    // новости чужой страницей нельзя — из WebView некуда возвращаться.
    const openExternal = useCallback((url: string) => {
        Linking.openURL(url).catch(() => {})
    }, [])

    const handleMessage = useCallback(
        (event: WebViewMessageEvent) => {
            let payload: { type?: string; height?: number; url?: string }
            try {
                payload = JSON.parse(event.nativeEvent.data)
            } catch {
                return
            }

            // Высота приходит в CSS-пикселях, а они во WebView равны dp —
            // домножать на SIZES.PX нельзя, размеры внутри документа уже
            // посчитаны с ним (см. buildHtmlDocument).
            if (payload.type === 'height' && payload.height) {
                setHeight(payload.height)
                return
            }

            if (payload.type === 'link' && payload.url) {
                openExternal(payload.url)
            }
        },
        [openExternal]
    )

    // Подстраховка поверх перехвата кликов: на iOS видно, что навигация идёт
    // в главном фрейме, — такую уводим наружу. На Android признака нет,
    // поэтому там пропускаем всё, иначе ломаются iframe-плееры.
    const handleShouldStartLoad = useCallback(
        // isTopFrame есть только в iOS-варианте запроса и наружу пакетом
        // не типизирован — дописываем полем.
        (request: WebViewNavigation & { isTopFrame?: boolean }) => {
            const url = request.url
            const isDocument =
                !url ||
                url === baseUrl ||
                url.startsWith('about:') ||
                url.startsWith('data:')

            if (
                Platform.OS === 'ios' &&
                request.isTopFrame &&
                !isDocument &&
                url.startsWith('http')
            ) {
                openExternal(url)
                return false
            }

            return true
        },
        [baseUrl, openExternal]
    )

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    width: '100%',
                },
                // Пока высота не замерена, WebView невидим и вынесен из потока,
                // чтобы не распирать карточку на весь экран. Размонтировать его
                // нельзя — иначе он не догрузится и высоту не пришлёт.
                webViewBox: {
                    height: isWebViewReady ? height : MEASURE_HEIGHT,
                    width: '100%',
                    opacity: isWebViewReady ? 1 : 0,
                    position: isWebViewReady ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                },
                // Фон даёт карточка снаружи, сам WebView прозрачный.
                webView: {
                    flex: 1,
                    backgroundColor: 'transparent',
                },
            }),
        [height, isWebViewReady]
    )

    return (
        <View style={[styles.container, style]} onLayout={handleLayout}>
            {!isWebViewReady && width > 0 && (
                <HtmlFallback html={html} contentWidth={width} />
            )}

            <View
                style={styles.webViewBox}
                pointerEvents={isWebViewReady ? 'auto' : 'none'}
            >
                <WebView
                    style={styles.webView}
                    source={source}
                    originWhitelist={['*']}
                    injectedJavaScript={HEIGHT_REPORTER_SCRIPT}
                    onMessage={handleMessage}
                    onShouldStartLoadWithRequest={handleShouldStartLoad}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    automaticallyAdjustContentInsets={false}
                    allowsInlineMediaPlayback
                    allowsFullscreenVideo
                    setSupportMultipleWindows={false}
                    javaScriptEnabled
                />
            </View>
        </View>
    )
})
