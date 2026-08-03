import { Slot } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppStore, SIZES, ThemeStore } from '../../shared'
import { BottomMenu, useBottomMenuClearance } from '../../shared/BottomMenu'
import { CheckNetworkWidget } from '../../widgets/CheckNetworkWidget'
import { MainHeaderWidget } from '../../widgets/MainHeaderWidget'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AmbientBackground } from '../../shared/AmbientBackground'

type Props = {}

const Layout = (props: Props) => {
    const isHasNet = AppStore.useIsHasNet()
    const COLORS = ThemeStore.useCOLORS()
    const bottomClearance = useBottomMenuClearance()
    const styles = StyleSheet.create({
        wrapper: {
            flex: 1,
            backgroundColor: COLORS.BACKGROUND.Primary,
            position: 'relative',
        },
        main: {
            flex: 1,
            paddingHorizontal: SIZES.PX * 20,
        },
    })
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: COLORS.BACKGROUND.Primary }}
            // Низ не в safe-area: контент уходит под плавающий таб-бар,
            // а его собственный отступ даёт useBottomMenuClearance ниже.
            edges={['top', 'right', 'left']}
        >
            <View style={styles.wrapper}>
                <AmbientBackground />

                <MainHeaderWidget />
                <KeyboardAwareScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.main}
                    contentContainerStyle={{
                        paddingBottom: bottomClearance,
                    }}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid
                >
                    {!isHasNet ? <CheckNetworkWidget /> : <Slot />}
                </KeyboardAwareScrollView>
                <BottomMenu />
            </View>
        </SafeAreaView>
    )
}

export default Layout
