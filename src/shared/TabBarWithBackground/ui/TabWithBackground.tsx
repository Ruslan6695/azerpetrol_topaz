import { memo, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { ITabWithBackground } from '../config/interfaces/ITabWithBackground'
import { Typography } from '../../Typography'
import { ThemeStore } from '../../common/model/themeStore'
import { EColorThemes } from '../../common/config/enums/EColorThemes'

interface IProps extends ITabWithBackground {
    isFirst: boolean
    isLast: boolean
    isSelected: boolean
    onPress: (tab: ITabWithBackground) => void
}

export const TabWithBackground = memo(
    ({ label, value, isFirst, isLast, isSelected, onPress }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const colorTheme = ThemeStore.useTheme()
        const styles = useMemo(
            () =>
                StyleSheet.create({
                    container: {
                        flex: 1,
                        alignItems: 'center',
                        paddingVertical: SIZES.PX * 15,
                        backgroundColor: isSelected
                            ? COLORS.BRAND.Primary
                            : COLORS.BACKGROUND.Tertiary,
                        borderTopLeftRadius: isFirst
                            ? 10 * SIZES.PX
                            : undefined,
                        borderBottomLeftRadius: isFirst
                            ? 10 * SIZES.PX
                            : undefined,
                        borderTopRightRadius: isLast
                            ? 10 * SIZES.PX
                            : undefined,
                        borderBottomRightRadius: isLast
                            ? 10 * SIZES.PX
                            : undefined,
                    },
                }),
            [COLORS, isFirst, isSelected, isLast]
        )
        const handlePress = useCallback(() => {
            onPress({ label, value })
        }, [value, label, onPress])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.container}
            >
                <Typography
                    color={
                        colorTheme === EColorThemes.LIGHT && isSelected
                            ? 'invert'
                            : undefined
                    }
                >
                    {label.toUpperCase()}
                </Typography>
            </CustomTouchableOpacity>
        )
    }
)
