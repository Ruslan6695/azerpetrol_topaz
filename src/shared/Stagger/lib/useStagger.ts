import { useCallback, useEffect, useRef } from 'react'
import { EntryExitAnimationFunction } from 'react-native-reanimated'
import { MOTION, STAGGER } from '../../common/config/constants/MOTION'
import { contentIn } from '../../common/config/lib/motion/animations'

// Каскадное появление элементов списка. Задержку элемент получает один раз,
// на своём маунте, и только если смонтировался внутри окна после маунта списка.
//
// Окно решает три задачи разом:
// — пагинация: строки второй страницы монтируются через секунды, окно уже
//   закрыто, и они появляются вместе, а не лесенкой на несколько секунд;
// — уже смонтированные строки не перемонтируются и каскад не переигрывают;
// — переиспользуемые ячейки FlashList при доскролле тоже попадают за окно:
//   иначе элемент с индексом 57 ждал бы больше двух секунд, будучи на экране.
//
// resetKey нужен там, где набор данных меняется целиком и каскад должен
// сыграть заново (например смена периода в истории).
export const useStagger = (resetKey?: unknown) => {
    const mountedAt = useRef(Date.now())

    useEffect(() => {
        mountedAt.current = Date.now()
    }, [resetKey])

    // undefined — элемент появляется мгновенно, без анимации.
    return useCallback(
        (index: number): EntryExitAnimationFunction | undefined => {
            if (Date.now() - mountedAt.current > STAGGER.WINDOW) {
                return undefined
            }
            return contentIn(
                Math.min(index, STAGGER.MAX_ITEMS) * MOTION.STAGGER_STEP
            )
        },
        []
    )
}
