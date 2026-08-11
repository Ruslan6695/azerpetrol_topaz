import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { EColorThemes } from '../../../common/config/enums/EColorThemes'
import { PRESS_SCALE } from '../../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../../common/config/constants/RADII'
import { SIZES } from '../../../common/config/constants/sizes'
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
                backgroundColor: isActive
                    ? COLORS.ACCENT.Lime
                    : 'transparent',
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
                <View style={styles.iconPill}>
                    <Icon
                        name={name}
                        size={22}
                        color={
                            isActive
                                ? COLORS.ACCENT.OnLime
                                : COLORS.TEXT.Secondary
                        }
                    />
                </View>
                <Typography type="tabLabel" customColor={labelColor}>
                    {title}
                </Typography>
            </PressableScale>
        )
    }
)
