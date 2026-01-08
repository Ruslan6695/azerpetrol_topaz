import Ionicons from '@expo/vector-icons/Ionicons'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, ThemeStore, UserStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { ArrowIcon } from '../../../../shared/Icons/ArrowIcon'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const ExitFromProfile = memo((props: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const logout = UserStore.useLogout()
    const onPress = useCallback(() => {
        logout()
    }, [])

    const styles = StyleSheet.create({
        exitContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: SIZES.PX * 16,
            paddingHorizontal: SIZES.PX * 12,
            borderBottomColor: COLORS.BACKGROUND.Tertiary,
            borderBottomWidth: 2 * SIZES.PX,
        },
        left: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    })
    return (
        <CustomTouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            style={styles.exitContainer}
        >
            <View style={styles.left}>
                <Typography type="bodyAccentSmall" marginsPaddings={{ ml: 12 }}>
                    Выйти из аккаунта
                </Typography>
            </View>
            <ArrowIcon />
        </CustomTouchableOpacity>
    )
})
