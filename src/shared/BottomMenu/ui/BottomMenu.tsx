import { useRouteInfo } from 'expo-router/build/hooks'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'
import { Glass } from '../../GlassCard'
import { BottomMenuItem } from '../BottomMenuItem'
import { BOTTOM_MENU_ITEMS } from '../config/constants/BOTTOM_MENU_ITEMS'

type Props = {}

export const BottomMenu = (props: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const insets = useSafeAreaInsets()
    const route = useRouteInfo()

    const styles = useMemo(() => {
        return StyleSheet.create({
            // Тень снаружи: на Android overflow:'hidden' у Glass гасит elevation,
            // поэтому она не может лежать на том же View, что и скругление.
            shadow: {
                position: 'absolute',
                left: 16 * SIZES.PX,
                right: 16 * SIZES.PX,
                bottom: SPACING.TABBAR_BOTTOM * SIZES.PX + insets.bottom,
                borderRadius: RADII.TABBAR * SIZES.PX,
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 28 * SIZES.PX,
                shadowOffset: { width: 0, height: 8 },
                elevation: 12,
            },
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8 * SIZES.PX,
                paddingHorizontal: 10 * SIZES.PX,
            },
        })
    }, [COLORS, insets.bottom])

    return (
        <View style={styles.shadow}>
            <Glass level="secondary" radius={RADII.TABBAR * SIZES.PX}>
                <View style={styles.row}>
                    {BOTTOM_MENU_ITEMS.map((item) => (
                        <BottomMenuItem
                            key={item.link}
                            isActive={route.pathname === item.link}
                            {...item}
                        />
                    ))}
                </View>
            </Glass>
        </View>
    )
}
