import { memo } from 'react'
import { ActivityIndicator } from 'react-native'
import { COLORS } from '../../common/config/constants/COLORS'
import { MPLayout } from '../../MpLayout'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'

type Props = {
    small?: boolean
    marginsPaddings?: IMarginsPaddings
    color?: string
}

export const Loader = memo(({ small, marginsPaddings, color }: Props) => {
    return (
        <MPLayout {...marginsPaddings}>
            <ActivityIndicator
                color={color || COLORS.GRAY}
                size={small ? 'small' : 'large'}
            />
        </MPLayout>
    )
})
