import { Slot } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppStore, COLORS, SIZES } from '../../shared'
import { BottomMenu } from '../../shared/BottomMenu'
import { MainHeaderWidget } from '../../widgets/MainHeaderWidget'
import { CheckNetworkWidget } from '../../widgets/CheckNetworkWidget'
import { changePushToken } from '../../features/ChangePushToken'

type Props = {}

const Layout = (props: Props) => {
    const isHasNet = AppStore.useIsHasNet()
    useEffect(() => {
        changePushToken()
    }, [])
    return (
        <>
            <View style={styles.wrapper}>
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
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        position: 'relative',
    },
    main: {
        flex: 1,
        paddingHorizontal: SIZES.PX * 20,
    },
})
export default Layout
