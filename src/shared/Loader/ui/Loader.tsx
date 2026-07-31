import { memo } from 'react'
import { ActivityIndicator } from 'react-native'
import { IMarginsPaddings } from '../../common/config/interfaces/IMarginsPaddings'
import { ThemeStore } from '../../common/model/themeStore'
import { MPLayout } from '../../MpLayout'

type Props = {
    small?: boolean
    marginsPaddings?: IMarginsPaddings
    color?: 'primary' | 'invert'
    /** Крайний случай — когда индикатор лежит на лайме или другой заливке вне палитры текста */
    customColor?: string
}

export const Loader = memo(
    ({ small, marginsPaddings, color, customColor }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        return (
            <MPLayout {...marginsPaddings}>
                <ActivityIndicator
                    color={
                        customColor
                            ? customColor
                            : color === 'invert'
                            ? COLORS.Icon.Invert
                            : COLORS.Icon.Primary
                    }
                    size={small ? 'small' : 'large'}
                />
            </MPLayout>
        )
    }
)
