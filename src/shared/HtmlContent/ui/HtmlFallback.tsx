import { memo, useMemo } from 'react'
import RenderHTML, {
    MixedStyleRecord,
    defaultSystemFonts,
} from 'react-native-render-html'
import { FONTS } from '../../common/config/constants/FONTS'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'

type Props = {
    html: string
    /** Доступная ширина в пикселях устройства (замеряется по onLayout) */
    contentWidth: number
}

// Текстовый слой, который видно, пока грузится WebView: RenderHTML рисуется
// синхронно, нативными Text. Картинки и видео он не потянет — за ними и нужен
// WebView, — но текст новости появляется сразу, без пустой карточки.
// Он же остаётся на экране, если WebView так и не отчитался о высоте.
export const HtmlFallback = memo(({ html, contentWidth }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const baseStyle = useMemo(
        () => ({
            color: COLORS.TEXT.Secondary,
            fontFamily: FONTS.SEMIBOLD,
            fontSize: 13 * SIZES.PX,
            lineHeight: 13 * 1.55 * SIZES.PX,
        }),
        [COLORS]
    )

    const tagsStyles: MixedStyleRecord = useMemo(
        () => ({
            a: {
                color: COLORS.ACCENT.Primary,
                textDecorationLine: 'none',
            },
            b: { fontFamily: FONTS.BOLD, color: COLORS.TEXT.Primary },
            strong: { fontFamily: FONTS.BOLD, color: COLORS.TEXT.Primary },
            h1: {
                color: COLORS.TEXT.Primary,
                fontFamily: FONTS.EXTRABOLD,
                fontSize: 20 * SIZES.PX,
            },
            h2: {
                color: COLORS.TEXT.Primary,
                fontFamily: FONTS.EXTRABOLD,
                fontSize: 18 * SIZES.PX,
            },
            h3: {
                color: COLORS.TEXT.Primary,
                fontFamily: FONTS.EXTRABOLD,
                fontSize: 16 * SIZES.PX,
            },
        }),
        [COLORS]
    )

    // Manrope не подхватится, пока начертания не перечислены в systemFonts.
    const systemFonts = useMemo(
        () => [
            ...defaultSystemFonts,
            FONTS.SEMIBOLD,
            FONTS.BOLD,
            FONTS.EXTRABOLD,
        ],
        []
    )

    return (
        <RenderHTML
            contentWidth={contentWidth}
            baseStyle={baseStyle}
            tagsStyles={tagsStyles}
            systemFonts={systemFonts}
            source={{ html }}
        />
    )
})
