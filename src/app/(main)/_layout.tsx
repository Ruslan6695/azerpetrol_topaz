import { Navigator } from 'expo-router'
import React, { useCallback, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppStore, SIZES, ThemeStore } from '../../shared'
import { BottomMenu, useBottomMenuClearance } from '../../shared/BottomMenu'
import { ScreenTransition } from '../../shared/ScreenTransition'
import { CheckNetworkWidget } from '../../widgets/CheckNetworkWidget'
import { MainHeaderWidget } from '../../widgets/MainHeaderWidget'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AmbientBackground } from '../../shared/AmbientBackground'

type Props = {}

const Layout = (props: Props) => {
    const isHasNet = AppStore.useIsHasNet()
    const COLORS = ThemeStore.useCOLORS()
    const bottomClearance = useBottomMenuClearance()
    const scrollRef = useRef<KeyboardAwareScrollView>(null)

    // Скролл общий на все табы: без сброса новый таб открывается на позиции
    // предыдущего, и с анимацией входа это особенно заметно. Без анимации
    // самого скролла — одновременный проезд вверх и фейд читаются как мусор.
    // Дёргает ScreenTransition на смене маршрута внутри группы: сам лэйаут
    // на навигацию больше не подписан и на ней не перерисовывается.
    const handleRouteChange = useCallback(() => {
        scrollRef.current?.scrollToPosition(0, 0, false)
    }, [])
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
        // Navigator держит навигатор группы живым всё время жизни лэйаута,
        // а перемонтируется только его содержимое: иначе key на обёртке
        // пересоздавал бы сам навигатор на каждой смене таба.
        <Navigator>
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
                        ref={scrollRef}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={styles.main}
                        contentContainerStyle={{
                            paddingBottom: bottomClearance,
                        }}
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid
                    >
                        {!isHasNet ? (
                            <CheckNetworkWidget />
                        ) : (
                            <ScreenTransition onRouteChange={handleRouteChange}>
                                <Navigator.Slot />
                            </ScreenTransition>
                        )}
                    </KeyboardAwareScrollView>
                    <BottomMenu />
                </SafeAreaView>
            </View>
        </Navigator>
    )
}

export default Layout
