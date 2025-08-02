import { ReactNode } from 'react'
import { SvgProps } from 'react-native-svg'

export interface IProfileLinkItem {
    icon: React.FC<SvgProps>
    title: string
    link: string
    onPress?: () => void
}
