import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { Typography } from '../../Typography'
import { TStatusPillTones } from '../config/types/TStatusPillTones'

type Props = {
    label: string
    tone?: TStatusPillTones
    icon?: ReactNode
}

// Статус-пилюля из детали операции: только рамка и текст, без заливки.
export const StatusPill = memo(
    ({ label, tone = 'neutral', icon }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const color =
            tone === 'positive'
                ? COLORS.STATE.Positive
                : tone === 'destructive'
                ? COLORS.STATE.Destructive
                : tone === 'lime'
                ? COLORS.ACCENT.Lime
                : COLORS.TEXT.Secondary

        const styles = StyleSheet.create({
            container: {
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 6 * SIZES.PX,
                borderRadius: RADII.PILL,
                borderWidth: 1,
                borderColor: color,
                paddingVertical: 6 * SIZES.PX,
                paddingHorizontal: 16 * SIZES.PX,
            },
        })

        return (
            <View style={styles.container}>
                {icon}
                <Typography type="caption12" customColor={color}>
                    {label}
                </Typography>
            </View>
        )
    }
)
