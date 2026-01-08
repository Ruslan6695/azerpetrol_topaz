import { memo } from 'react'
import { Typography } from '../../../shared/Typography'

type Props = {
    title: string
    mb?: number
    ml?: number
}

export const ScreenTitle = memo(({ title, mb, ml }: Props) => {
    return (
        <Typography
            marginsPaddings={{
                mb: mb !== undefined ? mb : 10,
                ml: ml !== undefined ? ml : 10,
            }}
            type="displayMedium"
        >
            {title}
        </Typography>
    )
})
