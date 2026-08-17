import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { IDonutSegment } from '../config/interfaces/IDonutSegment'

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
                            <Circle
                                key={arc.key}
                                cx={box / 2}
                                cy={box / 2}
                                r={radius}
                                fill="none"
                                stroke={arc.color}
                                strokeWidth={stroke}
                                strokeDasharray={`${arc.length} ${circumference}`}
                                strokeDashoffset={-arc.offset}
                            />
                        ))
                    )}
                </Svg>
                {children}
            </View>
        )
    }
)
