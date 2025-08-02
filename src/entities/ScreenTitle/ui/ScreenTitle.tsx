import { memo } from 'react'
import { CustomText } from '../../../shared/CustomText'

type Props = {
    title: string
    mb?: number
    ml?: number
}

export const ScreenTitle = memo(({ title, mb, ml }: Props) => {
    return (
        <CustomText
            marginsPaddings={{
                mb: mb !== undefined ? mb : 10,
                ml: ml !== undefined ? ml : 10,
            }}
            fw="700"
            fz={20}
        >
            {title.toUpperCase()}
        </CustomText>
    )
})
