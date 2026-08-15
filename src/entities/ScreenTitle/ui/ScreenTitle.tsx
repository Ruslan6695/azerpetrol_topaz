import { memo } from 'react'
import { Typography, TTypographyTypes } from '../../../shared/Typography'

type Props = {
    title: string
    mb?: number
    ml?: number
    /** Размер заголовка. По умолчанию h4 (26) — на экране выбора топлива h6 (22) */
    type?: TTypographyTypes
}

export const ScreenTitle = memo(({ title, mb, ml, type = 'h4' }: Props) => {
    return (
        <Typography
            marginsPaddings={{
                mb: mb !== undefined ? mb : 10,
                ml: ml !== undefined ? ml : 10,
            }}
            type={type}
        >
            {title}
        </Typography>
    )
})
