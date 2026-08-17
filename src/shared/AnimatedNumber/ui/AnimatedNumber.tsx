import { memo, useEffect, useRef, useState } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { divideNumber } from '../../common/config/lib/helpers/divideNumber'
import { Typography } from '../../Typography'
import { TTypographyColorTypes } from '../../Typography/config/types/TTypographyColorTypes'
import { TTypographyTypes } from '../../Typography/config/types/TTypographyTypes'
import { COUNT_UP_DURATION } from '../config/constants/COUNT_UP_DURATION'

type Props = {
    value: number
    /** Приписка вплотную к числу — «₽», «B». Не анимируется */
    suffix?: string
    type: TTypographyTypes
    color?: TTypographyColorTypes
    customColor?: string
    style?: StyleProp<TextStyle>
    numberOfLines?: number
}

// Число с набеганием от нуля при первом появлении — из макета: 900 мс,
// ease-out cubic.
//
// Отдельный компонент, а не хук в родителе: счётчик перерисовывается
// каждый кадр, и родителем ему быть нельзя — в карточке баланса это
// потянуло бы за собой BlurView.
//
// Набегание проигрывается ОДИН раз, на первом ненулевом значении (заход в
// приложение). Дальнейшие изменения — например баланс после перевода
// бонусов — подставляются сразу: там число меняется по действию
// пользователя, и отсчёт от нуля читался бы как обнуление счёта.
export const AnimatedNumber = memo(
    ({
        value,
        suffix,
        type,
        color,
        customColor,
        style,
        numberOfLines,
    }: Props) => {
        const [current, setCurrent] = useState(value)
        const hasAnimatedRef = useRef(false)
        const frameRef = useRef<number | null>(null)

        useEffect(() => {
            if (hasAnimatedRef.current || value <= 0) {
                // Ноль не анимируем: иначе первое же реальное значение
                // посчиталось бы уже проигранным и появилось бы рывком.
                setCurrent(value)
                return
            }

            hasAnimatedRef.current = true

            // Дробную часть держим ту же, что у цели: баланс приходит
            // копейками (0.47), и округление до целых обнулило бы его.
            const decimals = (String(value).split('.')[1] ?? '').length
            const start = Date.now()

            const tick = () => {
                const progress = Math.min(
                    1,
                    (Date.now() - start) / COUNT_UP_DURATION
                )
                const eased = 1 - Math.pow(1 - progress, 3)

                setCurrent(Number((value * eased).toFixed(decimals)))

                if (progress < 1) {
                    frameRef.current = requestAnimationFrame(tick)
                }
            }

            frameRef.current = requestAnimationFrame(tick)

            return () => {
                if (frameRef.current !== null) {
                    cancelAnimationFrame(frameRef.current)
                }
            }
        }, [value])

        return (
            <Typography
                type={type}
                color={color}
                customColor={customColor}
                style={style}
                numberOfLines={numberOfLines}
            >
                {divideNumber(current)}
                {suffix ?? ''}
            </Typography>
        )
    }
)
