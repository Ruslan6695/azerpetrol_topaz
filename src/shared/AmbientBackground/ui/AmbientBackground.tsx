import { LinearGradient } from 'expo-linear-gradient'
import { memo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'

// Угол фонового градиента макета: CSS `165deg` — направление
// (sin165, −cos165) ≈ (0.26, 0.97), то есть сверху вниз с уходом вправо.
// В долях бокса линия градиента идёт из (0.2, 0) в (0.8, 1).
const GRADIENT_ANGLE = { start: { x: 0.2, y: 0 }, end: { x: 0.8, y: 1 } }
const GRADIENT_LOCATIONS = [0, 0.5, 1] as const

type Offset = { x: number; y: number; blur: number }

type SpherePosition = {
    top?: number
    bottom?: number
    left?: number
    right?: number
}

type SphereGeometry = {
    size: number
    position: SpherePosition
    /** Центр радиального градиента — CSS `circle at cx cy` */
    cx: string
    cy: string
    /** Положение средней точки градиента */
    mid: string
    /** Внутренняя подсветка края, внутренняя тень объёма, падающая тень */
    rim: Offset
    depth: Offset
    drop: Offset
}

// Геометрия сфер из макета (dc.html:29–31 и 34–36). Одинакова в обеих темах —
// по теме различаются только цвета, они лежат в COLORS.AMBIENT.
const SPHERES: SphereGeometry[] = [
    {
        size: 430,
        position: { top: -230, right: -130 },
        cx: '32%',
        cy: '28%',
        mid: '45%',
        rim: { x: -14, y: -22, blur: 46 },
        depth: { x: 18, y: 24, blur: 50 },
        drop: { x: 0, y: 24, blur: 70 },
    },
    {
        size: 560,
        position: { top: 210, left: -260 },
        cx: '68%',
        cy: '26%',
        mid: '48%',
        rim: { x: 16, y: -20, blur: 52 },
        depth: { x: -18, y: 26, blur: 56 },
        drop: { x: 0, y: 30, blur: 80 },
    },
    {
        size: 480,
        position: { bottom: -250, right: -160 },
        cx: '40%',
        cy: '22%',
        mid: '46%',
        rim: { x: -10, y: -24, blur: 48 },
        depth: { x: 16, y: 20, blur: 48 },
        drop: { x: 0, y: -20, blur: 70 },
    },
]

const scalePosition = ({
    top,
    bottom,
    left,
    right,
}: SpherePosition): ViewStyle => ({
    ...(top !== undefined && { top: top * SIZES.PX }),
    ...(bottom !== undefined && { bottom: bottom * SIZES.PX }),
    ...(left !== undefined && { left: left * SIZES.PX }),
    ...(right !== undefined && { right: right * SIZES.PX }),
})

const shadow = (offset: Offset, color: string, inset?: boolean) => ({
    offsetX: offset.x * SIZES.PX,
    offsetY: offset.y * SIZES.PX,
    blurRadius: offset.blur * SIZES.PX,
    color,
    ...(inset && { inset: true }),
})

type SphereProps = {
    geometry: SphereGeometry
    /** Стопы радиального градиента: центр, средняя точка, край */
    colors: [string, string, string]
    rimColor: string
    depthColor: string
    dropColor: string
    /** Уникальный суффикс id градиента: id в SVG глобальны на всё дерево */
    id: string
}

// Объём сферы держится на box-shadow: подсветка края и тень внутри плюс
// падающая снаружи. Это New Architecture API (RN 0.76+); на Android inset-тени
// работают с API 29, на более старых сфера деградирует до плоского градиента —
// отдельный фоллбэк для этого не пишем, фон остаётся читаемым.
const Sphere = memo(
    ({
        geometry,
        colors,
        rimColor,
        depthColor,
        dropColor,
        id,
    }: SphereProps) => {
        const box = geometry.size * SIZES.PX
        const half = box / 2
        const gradientId = `sphere-${id}`

        const styles = StyleSheet.create({
            sphere: {
                position: 'absolute',
                width: box,
                height: box,
                borderRadius: half,
                ...scalePosition(geometry.position),
                boxShadow: [shadow(geometry.drop, dropColor)],
            },
            lighting: {
                ...StyleSheet.absoluteFillObject,
                borderRadius: half,
                boxShadow: [
                    shadow(geometry.rim, rimColor, true),
                    shadow(geometry.depth, depthColor, true),
                ],
            },
        })

        return (
            <View pointerEvents="none" style={styles.sphere}>
                <Svg width={box} height={box}>
                    <Defs>
                        <RadialGradient
                            id={gradientId}
                            cx={geometry.cx}
                            cy={geometry.cy}
                            // CSS `circle at ...` без размера — это farthest-corner;
                            // для этих трёх центров расстояние до дальнего угла
                            // выходит ≈ 100% бокса.
                            r="100%"
                        >
                            <Stop offset="0%" stopColor={colors[0]} />
                            <Stop offset={geometry.mid} stopColor={colors[1]} />
                            <Stop offset="100%" stopColor={colors[2]} />
                        </RadialGradient>
                    </Defs>
                    <Circle
                        cx={half}
                        cy={half}
                        r={half}
                        fill={`url(#${gradientId})`}
                    />
                </Svg>
                <View pointerEvents="none" style={styles.lighting} />
            </View>
        )
    }
)

// Фон макета: градиентная заливка и три объёмные сферы позади контента.
// Единственный фон приложения: старый BackgroundImage удалён вместе с последними
// его потребителями в ветке налива. Сферы статичны — прежний дрейф блобов
// дизайн убрал вместе с самими блобами.
export const AmbientBackground = memo(() => {
    const COLORS = ThemeStore.useCOLORS()

    return (
        <>
            <LinearGradient
                pointerEvents="none"
                colors={
                    [
                        COLORS.BACKGROUND.PrimaryGradientFrom,
                        COLORS.BACKGROUND.PrimaryGradientMid,
                        COLORS.BACKGROUND.PrimaryGradientTo,
                    ] as const
                }
                locations={GRADIENT_LOCATIONS}
                start={GRADIENT_ANGLE.start}
                end={GRADIENT_ANGLE.end}
                style={StyleSheet.absoluteFill}
            />
            <Sphere
                id="1"
                geometry={SPHERES[0]}
                colors={[
                    COLORS.AMBIENT.Sphere1From,
                    COLORS.AMBIENT.Sphere1Mid,
                    COLORS.AMBIENT.Sphere1To,
                ]}
                rimColor={COLORS.AMBIENT.Sphere1Rim}
                depthColor={COLORS.AMBIENT.Sphere1Depth}
                dropColor={COLORS.AMBIENT.Sphere1Drop}
            />
            <Sphere
                id="2"
                geometry={SPHERES[1]}
                colors={[
                    COLORS.AMBIENT.Sphere2From,
                    COLORS.AMBIENT.Sphere2Mid,
                    COLORS.AMBIENT.Sphere2To,
                ]}
                rimColor={COLORS.AMBIENT.Sphere2Rim}
                depthColor={COLORS.AMBIENT.Sphere2Depth}
                dropColor={COLORS.AMBIENT.Sphere2Drop}
            />
            <Sphere
                id="3"
                geometry={SPHERES[2]}
                colors={[
                    COLORS.AMBIENT.Sphere3From,
                    COLORS.AMBIENT.Sphere3Mid,
                    COLORS.AMBIENT.Sphere3To,
                ]}
                rimColor={COLORS.AMBIENT.Sphere3Rim}
                depthColor={COLORS.AMBIENT.Sphere3Depth}
                dropColor={COLORS.AMBIENT.Sphere3Drop}
            />
        </>
    )
})
