import { SvgProps } from 'react-native-svg'
import { ESCREENS } from '../../../../../shared'

export interface IProfileLinkItem {
    icon: React.FC<SvgProps>
    title: string
    link: ESCREENS
    onPress?: () => void
}
