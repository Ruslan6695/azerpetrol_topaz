import { memo } from 'react'
import { MPLayout } from '../../../shared/MpLayout'
import { IMarginsPaddings, SIZES } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'
import { IInfoBlock } from '../config/interfaces/IInfoBlock'
import { View } from 'react-native-reanimated/lib/typescript/Animated'

interface Props extends IInfoBlock {
    marginsPaddings?: IMarginsPaddings
}

export const InfoBlock = memo(({ marginsPaddings, info, title }: Props) => {
    return (
        <MPLayout
            style={{ width: SIZES.WIDTH(1) - SIZES.PX * 40 }}
            {...marginsPaddings}
        >
            <CustomText marginsPaddings={{ mb: 5 }} fw="500" fz={18}>
                {title}
            </CustomText>
            <CustomText fz={16} secondary>
                {info}
            </CustomText>
        </MPLayout>
    )
})
