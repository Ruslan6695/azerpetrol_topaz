import { LinearGradient } from 'expo-linear-gradient'
import { memo, useId, useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg'
import { SIZES } from '../../common/config/constants/sizes'
import { EColorThemes } from '../../common/config/enums/EColorThemes'
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
}

type SphereLighting = {
    /** Положение средней точки градиента */
    mid: string
    /** Внутренняя подсветка края */
    rim: Offset
    /** Внутреннее лаймовое свечение — есть только в тёмной теме */
    glow?: Offset
    /** Внутренняя тень объёма */
    depth: Offset
    /** Падающая тень — есть только в светлой теме */
    drop?: Offset
}

// Размер, позиция и центр градиента сфер из макета (dc.html:29–31 и 34–36) —
// одинаковы в обеих темах.
const SPHERES: SphereGeometry[] = [
    {
        size: 430,
        position: { top: -230, right: -130 },
        cx: '32%',
        cy: '28%',
    },
    {
        size: 560,
        position: { top: 210, left: -260 },
        cx: '68%',
        cy: '26%',
    },
    {
        size: 480,
        position: { bottom: -250, right: -160 },
        cx: '40%',
        cy: '22%',
    },
]

// Светотень по темам: в светлой это размытый ореол по краю, тень объёма и
// падающая тень; в тёмной — лаймовый волосок по краю (нулевое размытие),
// мягкое свечение внутрь и глубокая внутренняя тень, падающей нет.
const LIGHTING: { light: SphereLighting[]; dark: SphereLighting[] } = {
    light: [
        {
            mid: '45%',
            rim: { x: -14, y: -22, blur: 46 },
            depth: { x: 18, y: 24, blur: 50 },
            drop: { x: 0, y: 24, blur: 70 },
        },
        {
            mid: '48%',
            rim: { x: 16, y: -20, blur: 52 },
            depth: { x: -18, y: 26, blur: 56 },
            drop: { x: 0, y: 30, blur: 80 },
        },
        {
            mid: '46%',
            rim: { x: -10, y: -24, blur: 48 },
            depth: { x: 16, y: 20, blur: 48 },
            drop: { x: 0, y: -20, blur: 70 },
        },
    ],
    dark: [
        {
            mid: '50%',
            rim: { x: 1.5, y: -2, blur: 0 },
            glow: { x: 5, y: -7, blur: 14 },
            depth: { x: -14, y: 18, blur: 40 },
        },
        {
            mid: '50%',
            rim: { x: -1.5, y: 0, blur: 0 },
            glow: { x: -6, y: -4, blur: 14 },
            depth: { x: 16, y: 16, blur: 40 },
        },
        {
            mid: '50%',
            rim: { x: 1.5, y: 2, blur: 0 },
            glow: { x: 5, y: 7, blur: 14 },
            depth: { x: -14, y: -16, blur: 40 },
        },
    ],
}

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
    lighting: SphereLighting
    /** Стопы радиального градиента: центр, средняя точка, край */
    colors: [string, string, string]
    rimColor: string
    glowColor: string
    depthColor: string
    dropColor: string
    /**
     * Уникальный суффикс id градиента: id в SVG глобальны на всё дерево.
     * Обязан различаться и между экземплярами AmbientBackground — их бывает
     * два одновременно, см. комментарий у instanceId ниже.
     */
    id: string
}

// Объём сферы держится на box-shadow: подсветка края и тень внутри плюс
// падающая снаружи. Это New Architecture API (RN 0.76+); на Android inset-тени
// работают с API 29, на более старых сфера деградирует до плоского градиента —
// отдельный фоллбэк для этого не пишем, фон остаётся читаемым.
const Sphere = memo(
    ({
        geometry,
        lighting,
        colors,
        rimColor,
        glowColor,
        depthColor,
        dropColor,
        id,
    }: SphereProps) => {
        const box = geometry.size * SIZES.PX
        const half = box / 2
        const gradientId = `sphere-${id}`

        // Стили сферы — это описание её светотени: несколько размытых теней,
        // которые Android растеризует через BlurMaskFilter. Пересобирать их
        // на каждый рендер незачем, меняются они только со сменой темы.
        const styles = useMemo(
            () =>
                StyleSheet.create({
                    sphere: {
                        position: 'absolute',
                        width: box,
                        height: box,
                        borderRadius: half,
                        ...scalePosition(geometry.position),
                        ...(lighting.drop && {
                            boxShadow: [shadow(lighting.drop, dropColor)],
                        }),
                    },
                    lighting: {
                        ...StyleSheet.absoluteFillObject,
                        borderRadius: half,
                        boxShadow: [
                            shadow(lighting.rim, rimColor, true),
                            ...(lighting.glow
                                ? [shadow(lighting.glow, glowColor, true)]
                                : []),
                            shadow(lighting.depth, depthColor, true),
                        ],
                    },
                }),
            [
                box,
                half,
                geometry.position,
                lighting,
                rimColor,
                glowColor,
                depthColor,
                dropColor,
            ]
        )

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
                            <Stop offset={lighting.mid} stopColor={colors[1]} />
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

// Сферы намеренно вылезают за края экрана (top: -230, left: -260 и т.п.),
// поэтому фон обязан их обрезать. Без overflow: 'hidden' торчащая часть
// видна во время нативного перехода: въезжающий экран стоит правее, и сфера,
// выходящая за его левый край, рисуется поверх уезжающего экрана и уезжает
// вместе с ним влево. На неподвижном экране этого не заметно — там
// вылезающая часть просто за границей дисплея.
//
// От темы стиль не зависит, поэтому живёт на модуле, а не в теле компонента.
const rootStyles = StyleSheet.create({
    clip: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
})

// Фон макета: градиентная заливка и три объёмные сферы позади контента.
// Единственный фон приложения: старый BackgroundImage удалён вместе с последними
// его потребителями в ветке налива. Сферы статичны — прежний дрейф блобов
// дизайн убрал вместе с самими блобами.
export const AmbientBackground = memo(() => {
    const COLORS = ThemeStore.useCOLORS()
    const theme = ThemeStore.useTheme()

    // id градиентов уникальны на экземпляр, а не только на сферу. Во время
    // перехода на внутреннюю страницу смонтировано сразу два фона — свой у
    // группы табов и свой у InternalPagesLayout. С общими id ссылка
    // url(#sphere-N) переставала резолвиться, и сфера падала на дефолтную
    // заливку SVG — чёрную. Двоеточия из useId в id класть нельзя.
    const instanceId = useId().replace(/[^a-zA-Z0-9]/g, '')

    const lighting =
        theme === EColorThemes.DARK ? LIGHTING.dark : LIGHTING.light

    // Тёмная тема макета заливает фон плоско: все три стопа равны
    // BACKGROUND.Primary, которым родитель уже залит. Гонять ради этого
    // шейдер линейного градиента на весь экран — чистый overdraw, поэтому
    // при совпадающих стопах рисуем обычную заливку. В светлой теме стопы
    // различаются, там остаётся настоящий градиент.
    const gradientColors = [
        COLORS.BACKGROUND.PrimaryGradientFrom,
        COLORS.BACKGROUND.PrimaryGradientMid,
        COLORS.BACKGROUND.PrimaryGradientTo,
    ] as const
    const isFlatFill =
        gradientColors[0] === gradientColors[1] &&
        gradientColors[1] === gradientColors[2]

    const flatFillStyle = useMemo(
        () =>
            StyleSheet.create({
                fill: {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: gradientColors[0],
                },
            }),
        [gradientColors[0]]
    )

    return (
        // Фон статичен: он не зависит ни от какого покадрового состояния и
        // меняется только со сменой темы. Зато рисовать его дорого — три
        // SVG-сферы шире экрана и несколько размытых теней на каждую, а
        // boxShadow на Android идёт через BlurMaskFilter. Просим Android
        // растеризовать всё поддерево один раз в текстуру: при переходах,
        // когда экран едет, она композитится вместо повторной растеризации
        // размытий. Цена — видеопамять под текстуру размером с экран; для
        // статики это правильный размен (docs: View#renderToHardwareTextureAndroid).
        <View
            pointerEvents="none"
            style={rootStyles.clip}
            renderToHardwareTextureAndroid
            collapsable={false}
        >
            {isFlatFill ? (
                <View pointerEvents="none" style={flatFillStyle.fill} />
            ) : (
                <LinearGradient
                    pointerEvents="none"
                    colors={gradientColors}
                    locations={GRADIENT_LOCATIONS}
                    start={GRADIENT_ANGLE.start}
                    end={GRADIENT_ANGLE.end}
                    style={StyleSheet.absoluteFill}
                />
            )}
            <Sphere
                id={`${instanceId}-1`}
                geometry={SPHERES[0]}
                lighting={lighting[0]}
                colors={[
                    COLORS.AMBIENT.Sphere1From,
                    COLORS.AMBIENT.Sphere1Mid,
                    COLORS.AMBIENT.Sphere1To,
                ]}
                rimColor={COLORS.AMBIENT.Sphere1Rim}
                glowColor={COLORS.AMBIENT.Sphere1Glow}
                depthColor={COLORS.AMBIENT.Sphere1Depth}
                dropColor={COLORS.AMBIENT.Sphere1Drop}
            />
            <Sphere
                id={`${instanceId}-2`}
                geometry={SPHERES[1]}
                lighting={lighting[1]}
                colors={[
                    COLORS.AMBIENT.Sphere2From,
                    COLORS.AMBIENT.Sphere2Mid,
                    COLORS.AMBIENT.Sphere2To,
                ]}
                rimColor={COLORS.AMBIENT.Sphere2Rim}
                glowColor={COLORS.AMBIENT.Sphere2Glow}
                depthColor={COLORS.AMBIENT.Sphere2Depth}
                dropColor={COLORS.AMBIENT.Sphere2Drop}
            />
            <Sphere
                id={`${instanceId}-3`}
                geometry={SPHERES[2]}
                lighting={lighting[2]}
                colors={[
                    COLORS.AMBIENT.Sphere3From,
                    COLORS.AMBIENT.Sphere3Mid,
                    COLORS.AMBIENT.Sphere3To,
                ]}
                rimColor={COLORS.AMBIENT.Sphere3Rim}
                glowColor={COLORS.AMBIENT.Sphere3Glow}
                depthColor={COLORS.AMBIENT.Sphere3Depth}
                dropColor={COLORS.AMBIENT.Sphere3Drop}
            />
        </View>
    )
})
