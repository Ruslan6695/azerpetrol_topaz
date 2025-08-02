import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES, UserStore } from '../../../../shared'
import Ionicons from '@expo/vector-icons/Ionicons'
import { CustomText } from '../../../../shared/CustomText'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

type Props = {}

export const ExitFromProfile = memo((props: Props) => {
    const logout = UserStore.useLogout()
    const onPress = useCallback(() => {
        logout()
    }, [])
    return (
        <CustomTouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            style={styles.exitContainer}
        >
            <Ionicons
                name="exit-outline"
                size={25 * SIZES.PX}
                color={COLORS.RED}
            />
            <CustomText color={COLORS.RED} marginsPaddings={{ ml: 20 }}>
                Выйти из аккаунта
            </CustomText>
        </CustomTouchableOpacity>
    )
})

const styles = StyleSheet.create({
    exitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.PX * 10,
        borderTopColor: COLORS.GRAY_2,
        borderTopWidth: 1 * SIZES.PX,
    },
})
