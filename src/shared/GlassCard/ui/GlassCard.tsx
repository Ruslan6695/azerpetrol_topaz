import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode, memo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { PRESS_SCALE } from '../../common/config/constants/PRESS_SCALE'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { PressableScale } from '../../PressableScale'
import { TGlassCardVariants } from '../config/types/TGlassCardVariants'
import { Glass } from './Glass'

type Props = {
    children: ReactNode
    variant?: TGlassCardVariants
    /** В единицах макета, домножается на SIZES.PX внутри */
    radius?: number
    /** В единицах макета, домножается на SIZES.PX внутри */
    padding?: number
    /** Асимметричные паддинги макета. Перекрывают padding по своей стороне */
    paddingTop?: number
    paddingBottom?: number
    paddingHorizontal?: number
    paddingVertical?: number
    blur?: boolean
    bordered?: boolean
    onPress?: () => void
    /** Масштаб нажатия из PRESS_SCALE: у плиток он заметнее, чем у карточек */
    pressScale?: number
    style?: StyleProp<ViewStyle>
}

// Градиенты из макета: hero — linear-gradient(135deg, ...), что в RN
// соответствует start {0,0} → end {1,1}.
const GRADIENT_ANGLE = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }

export const GlassCard = memo(
    ({
        children,
        variant = 'glass',
        radius = RADII.CARD,
        padding = 20,
        paddingTop,
        paddingBottom,
        paddingHorizontal,
        paddingVertical,
        blur,
        bordered = true,
        onPress,
        pressScale = PRESS_SCALE.CARD,
        style,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const scaledRadius = radius * SIZES.PX
        // Асимметричные паддинги макета (22/20/18 у карточки баланса,
        // 16/18 у промо-строки). Заданные стороны перекрывают общий padding.
        const paddings = {
            padding: padding * SIZES.PX,
            paddingVertical:
                paddingVertical !== undefined
                    ? paddingVertical * SIZES.PX
                    : undefined,
            paddingHorizontal:
                paddingHorizontal !== undefined
                    ? paddingHorizontal * SIZES.PX
                    : undefined,
            paddingTop:
                paddingTop !== undefined ? paddingTop * SIZES.PX : undefined,
            paddingBottom:
                paddingBottom !== undefined
                    ? paddingBottom * SIZES.PX
                    : undefined,
        }
        const styles = StyleSheet.create({
            inner: paddings,
            gradient: {
                borderRadius: scaledRadius,
                overflow: 'hidden',
                borderWidth: bordered ? 1 : 0,
                // У градиентных карточек макета своя лаймовая рамка,
                // а не общий GLASS.Border. У bonus она чуть слабее.
                borderColor:
                    variant === 'bonus'
                        ? COLORS.GRADIENT.BorderSoft
                        : COLORS.GRADIENT.Border,
                ...paddings,
            },
        })

        // hero, lime и bonus — непрозрачные градиенты, блюр им не нужен.
        if (variant === 'hero' || variant === 'lime' || variant === 'bonus') {
            const colors =
                variant === 'hero'
                    ? ([
                          COLORS.GRADIENT.HeroFrom,
                          COLORS.GRADIENT.HeroMid,
                          COLORS.GLASS.Primary,
                      ] as const)
                    : variant === 'bonus'
                      ? ([
                            COLORS.GRADIENT.BonusFrom,
                            COLORS.GLASS.Primary,
                        ] as const)
                      : ([
                            COLORS.GRADIENT.LimeFrom,
                            COLORS.GLASS.Primary,
                        ] as const)

            const content = (
                <LinearGradient
                    colors={colors}
                    locations={variant === 'hero' ? [0, 0.6, 1] : undefined}
                    start={GRADIENT_ANGLE.start}
                    end={GRADIENT_ANGLE.end}
                    style={[styles.gradient, style]}
                >
                    {children}
                </LinearGradient>
            )

            return onPress ? (
                <PressableScale onPress={onPress} scaleTo={pressScale}>
                    {content}
                </PressableScale>
            ) : (
                content
            )
        }

        const card = (
            <Glass
                level={variant === 'glass2' ? 'secondary' : 'primary'}
                radius={scaledRadius}
                blur={blur}
                bordered={bordered}
                style={style}
            >
                <View style={styles.inner}>{children}</View>
            </Glass>
        )

        return onPress ? (
            <PressableScale onPress={onPress} scaleTo={pressScale}>
                {card}
            </PressableScale>
        ) : (
            card
        )
    }
)
