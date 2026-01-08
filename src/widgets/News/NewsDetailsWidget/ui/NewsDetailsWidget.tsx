import { memo } from 'react'
import RenderHTML from 'react-native-render-html'
import { Typography } from '../../../../shared/Typography'
import { TNewsDetailsScreenParams } from '../../../../entities/News/NewsItem'
import { EColorThemes, ThemeStore } from '../../../../shared'

type Props = {
    params: Partial<TNewsDetailsScreenParams>
}

export const NewsDetailsWidget = memo(({ params }: Props) => {
    const colorTheme = ThemeStore.useTheme()
    return (
        <>
            <Typography type="bodyAccentMedium">{params.header}</Typography>
            <Typography type="caption" marginsPaddings={{ mt: 5, mb: 10 }}>
                {params.date_create}
            </Typography>
            {params.html_text && (
                <RenderHTML
                    baseStyle={{
                        color:
                            colorTheme == EColorThemes.DARK
                                ? 'white'
                                : undefined,
                    }}
                    source={{ html: params.html_text }}
                />
            )}
        </>
    )
})
