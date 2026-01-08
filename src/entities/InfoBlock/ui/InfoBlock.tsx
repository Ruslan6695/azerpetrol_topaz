import { memo } from 'react'
import { IMarginsPaddings, SIZES } from '../../../shared'
import { MPLayout } from '../../../shared/MpLayout'
import { Typography } from '../../../shared/Typography'
import { IInfoBlock } from '../config/interfaces/IInfoBlock'

interface Props extends IInfoBlock {
    marginsPaddings?: IMarginsPaddings
}

export const InfoBlock = memo(({ marginsPaddings, info, title }: Props) => {
    return (
        <MPLayout
            style={{ width: SIZES.WIDTH(1) - SIZES.PX * 40 }}
            {...marginsPaddings}
        >
            <Typography marginsPaddings={{ mb: 5 }}>{title}</Typography>
            <Typography color="secondary" type="caption">
                {info}
            </Typography>
        </MPLayout>
    )
})
