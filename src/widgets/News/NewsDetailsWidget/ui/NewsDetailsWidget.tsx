import { memo } from 'react'
import { TNewsDetailsScreenParams } from '../../../../entities/NewsItem'
import { CustomText } from '../../../../shared/CustomText'
import RenderHTML from 'react-native-render-html'

type Props = {
    params: Partial<TNewsDetailsScreenParams>
}

export const NewsDetailsWidget = memo(({ params }: Props) => {
    return (
        <>
            <CustomText fw="700" fz={20}>
                {params.header}
            </CustomText>
            <CustomText marginsPaddings={{ mt: 5, mb: 10 }}>
                {params.date_create}
            </CustomText>
            {params.html_text && (
                <RenderHTML source={{ html: params.html_text }} />
            )}
        </>
    )
})
