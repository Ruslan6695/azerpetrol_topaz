import { ReactNode, memo, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import { MOTION } from '../../common/config/constants/MOTION'
import { SIZES } from '../../common/config/constants/sizes'
import { EASING } from '../../common/config/lib/motion/easing'
import { ThemeStore } from '../../common/model/themeStore'
import { IDonutSegment } from '../config/interfaces/IDonutSegment'
import { DonutArc } from './DonutArc'

type Props = {
    segments: IDonutSegment[]
    /** Внешний диаметр в единицах макета. По умолчанию 160 (dc.html:300) */
    size?: number
    /** Толщина кольца в единицах макета. По умолчанию 27 = (160 − 106) / 2 */
    thickness?: number
    /** Цвет кольца, когда сумма сегментов нулевая */
    trackColor?: string
    /** Содержимое центра кольца */
    children?: ReactNode
}

// Мультисегментное кольцо из макета (dc.html:299–301). В макете это
// conic-gradient, прямого аналога которому в RN нет — сегменты рисуются
// дугами react-native-svg.
//
// Отверстие честное, а не круг цвета фона: сквозь него должны просвечивать
// блобы AmbientBackground. По той же причине не нужен и transition фона
// при смене темы, который есть у макета.
export const DonutChart = memo(
    ({ segments, size = 160, thickness = 27, trackColor, children }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const box = size * SIZES.PX
        const stroke = thickness * SIZES.PX
        // Радиус считаем от фактического бокса: размеры домножены на SIZES.PX,
        // литерал длины окружности из макета разъедется (см. ProgressRing).
        const radius = (box - stroke) / 2
        const circumference = 2 * Math.PI * radius

        const total = segments.reduce(
            (sum, segment) => sum + Math.max(0, segment.value),
            0
        )

        // Накопительное смещение: каждая следующая дуга начинается там,
        // где закончилась предыдущая.
        let offset = 0
        const arcs = total
            ? segments
                  .filter((segment) => segment.value > 0)
                  .map((segment, index) => {
                      const length = (segment.value / total) * circumference
                      const arc = {
                          key: `${segment.color}-${index}`,
                          color: segment.color,
                          length,
                          offset,
                      }
                      offset += length
                      return arc
                  })
            : []

        // Кольцо рисуется одной линией по часовой. Подпись набора нужна,
        // чтобы перезапускать отрисовку при смене данных, но не на каждом
        // рендере: массив arcs пересоздаётся всегда.
        const signature = arcs
            .map((arc) => `${arc.color}:${Math.round(arc.length)}`)
            .join(',')
        const progress = useSharedValue(0)

        useEffect(() => {
            progress.value = 0
            progress.value = withTiming(1, {
                duration: MOTION.ARC_DRAW,
                easing: EASING.SCREEN,
            })
        }, [signature, progress])

        const styles = StyleSheet.create({
            container: {
                width: box,
                height: box,
                alignItems: 'center',
                justifyContent: 'center',
            },
            // Дуги рисуются от 3 часов — разворачиваем на 12.
            svg: {
                transform: [{ rotate: '-90deg' }],
            },
        })

        return (
            <View style={styles.container}>
                <Svg
                    width={box}
                    height={box}
                    style={[StyleSheet.absoluteFill, styles.svg]}
                >
                    {arcs.length === 0 ? (
                        <Circle
                            cx={box / 2}
                            cy={box / 2}
                            r={radius}
                            fill="none"
                            stroke={trackColor ?? COLORS.GLASS.Secondary}
                            strokeWidth={stroke}
                        />
                    ) : (
                        arcs.map((arc) => (
                            <DonutArc
                                key={arc.key}
                                progress={progress}
                                box={box}
                                radius={radius}
                                stroke={stroke}
                                color={arc.color}
                                circumference={circumference}
                                start={arc.offset}
                                length={arc.length}
                            />
                        ))
                    )}
                </Svg>
                {children}
            </View>
        )
    }
)
