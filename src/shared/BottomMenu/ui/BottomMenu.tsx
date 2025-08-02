import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { BOTTOM_MENU_ITEMS } from '../config/constants/BOTTOM_MENU_ITEMS'
import { BottomMenuItem } from '../BottomMenuItem'
import { useRouter } from 'expo-router'
import { useRouteInfo } from 'expo-router/build/hooks'
import { COLORS } from '../../common/config/constants/COLORS'

type Props = {}

export const BottomMenu = (props: Props) => {
    const route = useRouteInfo()

    return (
        <View style={styles.container}>
            {BOTTOM_MENU_ITEMS.map((item) => (
                <BottomMenuItem
                    key={item.link}
                    isActive={route.pathname === item.link}
                    {...item}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10 * SIZES.PX,
        paddingHorizontal: 20 * SIZES.PX,
        backgroundColor: COLORS.GRAY_3,
    },
})
