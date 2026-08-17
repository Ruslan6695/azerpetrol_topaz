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
        // Фон лежит снаружи SafeAreaView: сферы макета привязаны к краям
        // экрана, а абсолютные потомки SafeAreaView считаются от её padding-бокса
        // и уехали бы вниз на высоту статус-бара.
        screen: {
            flex: 1,
            backgroundColor: COLORS.BACKGROUND.Primary,
        },
        wrapper: {
            flex: 1,
            position: 'relative',
        },
        main: {
            flex: 1,
            paddingHorizontal: SIZES.PX * 20,
        },
    })
    return (
        <View style={styles.screen}>
            <AmbientBackground />
            <SafeAreaView
                style={styles.wrapper}
                // Низ не в safe-area: контент уходит под плавающий таб-бар,
                // а его собственный отступ даёт useBottomMenuClearance ниже.
                edges={['top', 'right', 'left']}
            >
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
            </SafeAreaView>
        </View>
    )
}

export default Layout
