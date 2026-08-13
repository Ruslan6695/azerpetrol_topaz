import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { COLORS } from '../../common/config/constants/COLORS'

type Params = {
    html: string
    colors: typeof COLORS
}

// Скрипт делает две вещи.
//
// 1. Замеряет высоту документа и шлёт её в RN: WebView сам по контенту не
//    растягивается, а вложенный скролл внутри экранного ScrollView недопустим.
//    ResizeObserver ловит дозагрузку картинок и раскрытие плееров,
//    load/resize — подстраховка для старых webview.
// 2. Перехватывает клики по ссылкам прямо в документе. Именно здесь, а не в
//    onShouldStartLoadWithRequest: на Android тот вызывается и для загрузки
//    iframe, а признака isTopFrame там нет — встроенный плеер улетал бы
//    в браузер вместо воспроизведения.
export const HEIGHT_REPORTER_SCRIPT = `
    (function () {
        var last = 0
        function post(payload) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload))
        }
        function report() {
            // Меряем именно контент body. documentElement.scrollHeight брать
            // нельзя: он не бывает меньше вьюпорта, а вьюпорт у скрытого
            // WebView во весь экран — короткая новость отдавала высоту экрана.
            var rect = document.body.getBoundingClientRect()
            var height = Math.ceil(
                Math.max(rect.height, document.body.scrollHeight)
            )
            if (height && Math.abs(height - last) > 1) {
                last = height
                post({ type: 'height', height: height })
            }
        }
        if (window.ResizeObserver) {
            new ResizeObserver(report).observe(document.body)
        }
        window.addEventListener('load', report)
        window.addEventListener('resize', report)
        document.addEventListener('readystatechange', report)
        document.addEventListener(
            'click',
            function (event) {
                var node = event.target
                while (node && node.tagName !== 'A') {
                    node = node.parentNode
                }
                if (node && node.href && /^https?:/i.test(node.href)) {
                    event.preventDefault()
                    post({ type: 'link', url: node.href })
                }
            },
            true
        )
        setTimeout(report, 100)
        setTimeout(report, 600)
        report()
    })()
    true;
`

/**
 * Собирает полноценный HTML-документ вокруг разметки бэкенда: типографика
 * и цвета из палитры темы, картинки и видео вписаны по ширине.
 * CSS-пиксель во WebView равен dp, поэтому размеры домножаем на SIZES.PX,
 * как и в остальной вёрстке.
 */
export const buildHtmlDocument = ({ html, colors }: Params) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>
    :root { color-scheme: light dark; }
    html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        overflow-x: hidden;
    }
    body {
        color: ${colors.TEXT.Secondary};
        font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
        font-size: ${13 * SIZES.PX}px;
        line-height: 1.55;
        font-weight: 600;
        word-wrap: break-word;
        -webkit-text-size-adjust: none;
    }
    p { margin: 0 0 ${10 * SIZES.PX}px; }
    p:last-child, ul:last-child, ol:last-child { margin-bottom: 0; }
    h1, h2, h3, h4, h5, h6 {
        color: ${colors.TEXT.Primary};
        font-weight: 800;
        margin: ${14 * SIZES.PX}px 0 ${6 * SIZES.PX}px;
        line-height: 1.25;
    }
    h1 { font-size: ${20 * SIZES.PX}px; }
    h2 { font-size: ${18 * SIZES.PX}px; }
    h3 { font-size: ${16 * SIZES.PX}px; }
    h4, h5, h6 { font-size: ${14 * SIZES.PX}px; }
    :first-child { margin-top: 0; }
    b, strong { color: ${colors.TEXT.Primary}; font-weight: 700; }
    a { color: ${colors.ACCENT.Primary}; text-decoration: none; }
    ul, ol { margin: 0 0 ${10 * SIZES.PX}px; padding-left: ${18 * SIZES.PX}px; }
    li { margin-bottom: ${4 * SIZES.PX}px; }
    hr { border: none; border-top: 1px solid ${colors.GLASS.Border}; margin: ${14 * SIZES.PX}px 0; }
    blockquote {
        margin: ${10 * SIZES.PX}px 0;
        padding-left: ${12 * SIZES.PX}px;
        border-left: 2px solid ${colors.GLASS.Border};
    }
    img, video {
        max-width: 100%;
        height: auto;
        display: block;
        margin: ${10 * SIZES.PX}px auto;
        border-radius: ${RADII.ROW * SIZES.PX}px;
    }
    iframe, embed, object {
        display: block;
        width: 100%;
        max-width: 100%;
        aspect-ratio: 16 / 9;
        height: auto;
        border: 0;
        margin: ${10 * SIZES.PX}px 0;
        border-radius: ${RADII.ROW * SIZES.PX}px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: ${12 * SIZES.PX}px;
    }
    td, th {
        border: 1px solid ${colors.GLASS.Border};
        padding: ${6 * SIZES.PX}px;
        text-align: left;
    }
    pre { overflow-x: auto; }
</style>
</head>
<body>${html}</body>
</html>`
