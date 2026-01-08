import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { BOTTOM_MENU_ITEMS } from '../config/constants/BOTTOM_MENU_ITEMS'
import { BottomMenuItem } from '../BottomMenuItem'
import { useRouter } from 'expo-router'
import { useRouteInfo } from 'expo-router/build/hooks'
import { ThemeStore } from '../../common/model/themeStore'
import { ESCREENS } from '../../common/config/enums/EScreens'

type Props = {}

export const BottomMenu = (props: Props) => {
    const colorTheme = ThemeStore.useTheme()
    const COLORS = ThemeStore.useCOLORS()
    const route = useRouteInfo()
    const styles = useMemo(() => {
        return StyleSheet.create({
            container: {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 10 * SIZES.PX,
                paddingHorizontal: 10 * SIZES.PX,
                paddingBottom: 0,
                backgroundColor: COLORS.BACKGROUND.Tertiary,
            },
        })
    }, [COLORS])

    return (
        <View style={styles.container}>
            {BOTTOM_MENU_ITEMS(colorTheme).map((item) => (
                <BottomMenuItem
                isMain={item.link === ESCREENS.HOME ? true : false}
                    key={item.link}
                    isActive={route.pathname === item.link}
                    {...item}
                />
            ))}
        </View>
    )
}
