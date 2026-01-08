import { Slot } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppStore, SIZES, ThemeStore } from '../../shared'
import { BottomMenu } from '../../shared/BottomMenu'
import { CheckNetworkWidget } from '../../widgets/CheckNetworkWidget'
import { MainHeaderWidget } from '../../widgets/MainHeaderWidget'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BackgroundImage } from '../../shared/BackgroundImage'

type Props = {}

const Layout = (props: Props) => {
    const isHasNet = AppStore.useIsHasNet()
    const COLORS = ThemeStore.useCOLORS()
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
            style={{ flex: 1, backgroundColor: COLORS.BACKGROUND.Tertiary }}
            edges={['bottom', 'right', 'left']}
        >
            <View style={styles.wrapper}>
                <BackgroundImage bottom={50} right={1} />

                <MainHeaderWidget />
                <KeyboardAwareScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.main}
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
