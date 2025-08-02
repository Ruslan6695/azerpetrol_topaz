import { ReactNode } from 'react'
import { SvgProps } from 'react-native-svg'

export interface IBottomMenuItem {
    icon: React.FC<SvgProps> 
    activeIcon: React.FC<SvgProps>
    link: string
    title?: string
}
