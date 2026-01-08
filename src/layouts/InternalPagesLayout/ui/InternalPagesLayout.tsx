import { ReactNode } from 'react'
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppStore, COLORS, SIZES, ThemeStore } from '../../../shared'
import { CheckNetworkWidget } from '../../../widgets/CheckNetworkWidget'
import { InternalPagesHeader } from '../../../widgets/InternalPagesHeader'
import { BackgroundImage } from '../../../shared/BackgroundImage'

type Props = {
    children: ReactNode
    hideScroll?: boolean
    onScrollToEnd?: () => void
    hideHeader?: boolean
    disablePaddings?: boolean
}

export const InternalPagesLayout = ({
    children,
    hideScroll,
    onScrollToEnd,
    disablePaddings,
    hideHeader,
}: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const isHasNet = AppStore.useIsHasNet()
    const handleScrollToEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (onScrollToEnd) {
            const scrollPosition = e.nativeEvent.contentOffset.y
            const scrollViewHeight = e.nativeEvent.layoutMeasurement.height
            const contentHeight = e.nativeEvent.contentSize.height
            const isScrolledToBottom = scrollViewHeight + scrollPosition
            if (Math.round(isScrolledToBottom) >= Math.round(contentHeight)) {
                onScrollToEnd()
            }
        }
    }

    const styles = StyleSheet.create({
        container: {
            backgroundColor: COLORS.BACKGROUND.Primary,
            flex: 1,
        },
        main: {
            flex: 1,
            paddingHorizontal: disablePaddings ? 0 : SIZES.PX * 20,
        },
    })

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <BackgroundImage bottom={-10} right={1} />
                {!hideHeader && <InternalPagesHeader />}{' '}
                <KeyboardAwareScrollView
                    onMomentumScrollEnd={handleScrollToEnd}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={!hideScroll}
                    viewIsInsideTabBar // чтобы на андроиде не добавлялся снизу серый блок
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid
                >
                    <View style={styles.main}>
                        {isHasNet ? children : <CheckNetworkWidget />}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </GestureHandlerRootView>
    )
}
