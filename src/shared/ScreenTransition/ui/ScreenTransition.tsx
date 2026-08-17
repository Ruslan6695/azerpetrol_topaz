import { Navigator } from 'expo-router'
import { ReactNode, memo, useEffect, useMemo } from 'react'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { screenIn } from '../../common/config/lib/motion/animations'

type Props = {
    children: ReactNode
    /** Побочный эффект на смену маршрута внутри группы — например сброс скролла */
    onRouteChange?: () => void
}

// Появление содержимого группы табов анимацией screenIn — там, где нативного
// перехода нет вовсе (внутри группы работает Slot, а не Stack).
//
// Ключ берётся из состояния СВОЕГО навигатора, а не из usePathname().
// usePathname() возвращает глобально активный маршрут: при push внутреннего
// экрана поверх группы он меняется, хотя сама группа никуда не уходила. На нём
// узел перемонтировался бы прямо во время нативного перехода — экран под
// уезжающим пересобирался бы целиком, и это давало заметный подлаг на всех
// внутренних страницах. Состояние навигатора группы при таком push не меняется.
//
// Компонент обязан быть потомком <Navigator> — контекст даёт именно он.
export const ScreenTransition = memo(({ children, onRouteChange }: Props) => {
    // Navigator.useContext — статик на публичном Navigator; сам хук из корня
    // пакета не экспортируется, а глубокий импорт в build/ переживёт не всякое
    // обновление expo-router.
    const { state } = Navigator.useContext()
    const routeKey = state.routes[state.index]?.key
    const enter = useMemo(() => screenIn(), [])

    useEffect(() => {
        onRouteChange?.()
        // onRouteChange намеренно не в зависимостях: эффект нужен на смену
        // маршрута, а не на каждое пересоздание колбэка вызывающим.
    }, [routeKey])

    return (
        // Аналог key={{ screenKey }} из макета: узел перемонтируется на смене
        // таба и заново играет screenIn. Стиля у обёртки быть не должно —
        // с flex: 1 контент схлопнется, у contentContainerStyle нет flexGrow.
        <Animated.View key={routeKey} entering={enter}>
            {/* Гасит анимации входа детей на этом же коммите: каскады
                и ContentIn не должны накладываться на screenIn. */}
            <LayoutAnimationConfig skipEntering>
                {children}
            </LayoutAnimationConfig>
        </Animated.View>
    )
})
