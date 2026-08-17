import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { EColorThemes } from '../../../common/config/enums/EColorThemes'
import { PRESS_SCALE } from '../../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../../common/config/constants/RADII'
import { SIZES } from '../../../common/config/constants/sizes'
import {
    TAB_BG_TRANSITION,
    TAB_ICON_TRANSITION,
} from '../../../common/config/lib/motion/transitions'
import { ThemeStore } from '../../../common/model/themeStore'
import { Icon } from '../../../Icons'
import { PressableScale } from '../../../PressableScale'
import { Typography } from '../../../Typography'
import { IBottomMenuItem } from '../config/interfaces/IBottomMenuItem'

interface IProps extends IBottomMenuItem {
    isActive: boolean
}

export const BottomMenuItem = memo(
    ({ name, isActive, link, title }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const colorTheme = ThemeStore.useTheme()
        const router = useRouter()

        const handlePress = useCallback(() => {
            router.navigate(link)
        }, [router, link])

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                gap: 3 * SIZES.PX,
                paddingVertical: 2 * SIZES.PX,
            },
            iconPill: {
                borderRadius: RADII.PILL,
                paddingVertical: 4 * SIZES.PX,
                paddingHorizontal: 16 * SIZES.PX,
                // Гаснем в лайм с нулевой альфой, а не в 'transparent':
                // переход через rgba(0,0,0,0) дал бы тёмный подтон на середине.
                backgroundColor: isActive
                    ? COLORS.ACCENT.Lime
                    : COLORS.ACCENT.LimeClear,
            },
            // Активная иконка лежит поверх неактивной и проявляется по opacity:
            // color у Icon — проп <Svg>, транзишеном его не взять.
            iconActive: {
                ...StyleSheet.absoluteFillObject,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isActive ? 1 : 0,
            },
        })

        // В светлой теме подпись активного таба тёмная (лайм на светлом фоне не читается).
        const labelColor = isActive
            ? colorTheme === EColorThemes.DARK
                ? COLORS.ACCENT.Lime
                : COLORS.TEXT.Primary
            : COLORS.TEXT.Secondary

        return (
            <PressableScale
                onPress={handlePress}
                scaleTo={PRESS_SCALE.TAB}
                style={styles.container}
            >
                <Animated.View style={[styles.iconPill, TAB_BG_TRANSITION]}>
                    <Icon name={name} size={22} color={COLORS.TEXT.Secondary} />
                    <Animated.View
                        style={[styles.iconActive, TAB_ICON_TRANSITION]}
                    >
                        <Icon
                            name={name}
                            size={22}
                            color={COLORS.ACCENT.OnLime}
                        />
                    </Animated.View>
                </Animated.View>
                <Typography type="tabLabel" customColor={labelColor}>
                    {title}
                </Typography>
            </PressableScale>
        )
    }
)
