import { ReactNode, memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { Glass } from '../../GlassCard'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { TGlassLevel } from '../../GlassCard/config/types/TGlassLevel'

type Props = {
    children: ReactNode
    level?: TGlassLevel
    blur?: boolean
    style?: StyleProp<ViewStyle>
}

// Стеклянная группа для ListRow: у неё нет внутренних отступов —
// их дают сами строки, а разделители между ними рисует ListRow.
export const ListGroup = memo(
    ({ children, level = 'primary', blur, style }: Props) => (
        <Glass
            level={level}
            radius={RADII.CARD * SIZES.PX}
            blur={blur}
            style={style}
        >
            {children}
        </Glass>
    )
)
