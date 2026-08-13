import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    changeColorThemeAsyncStore,
    EColorThemes,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../shared'
import { GlassCard } from '../../../shared/GlassCard'
import { Icon } from '../../../shared/Icons'
import { Switch } from '../../../shared/Switch'
import { Typography } from '../../../shared/Typography'

// Строка переключения темы из макета. Тапается вся карточка, поэтому
// у Switch своего обработчика нет.
export const ChangeColorTheme = memo(() => {
    const changeColorTheme = ThemeStore.useChangeColorTheme()
    const colorTheme = ThemeStore.useTheme()
    const isDark = colorTheme === EColorThemes.DARK

    const handlePress = useCallback(() => {
        const next = isDark ? EColorThemes.LIGHT : EColorThemes.DARK
        changeColorTheme(next)
        changeColorThemeAsyncStore(next)
    }, [isDark, changeColorTheme])

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        left: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.ROW_GAP * SIZES.PX,
        },
    })

    return (
        <GlassCard
            variant="glass2"
            radius={RADII.CARD}
            paddingVertical={SPACING.LG}
            paddingHorizontal={18}
            onPress={handlePress}
        >
            <View style={styles.row}>
                <View style={styles.left}>
                    <Icon name={isDark ? 'moon' : 'sun'} size={20} />
                    <Typography type="rowTitle">
                        {isDark ? 'Тёмная тема' : 'Светлая тема'}
                    </Typography>
                </View>

                <Switch value={isDark} />
            </View>
        </GlassCard>
    )
})
