import { LinearGradient } from 'expo-linear-gradient'
import { memo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'

type Props = {
    img: string
    header: string
    label?: string
    onPress: () => void
}

// Акция-картинка из макета: фото, тёмный скрим и текст поверх него.
export const PromotionImageCard = memo(
    ({ img, header, label, onPress }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            card: {
                height: 150 * SIZES.PX,
                borderRadius: RADII.CARD * SIZES.PX,
                overflow: 'hidden',
            },
            text: {
                position: 'absolute',
                left: SPACING.XL * SIZES.PX,
                right: SPACING.XL * SIZES.PX,
                bottom: SPACING.LG * SIZES.PX,
            },
            label: {
                textTransform: 'uppercase',
                letterSpacing: 0.4 * SIZES.PX,
            },
        })

        return (
            <PressableScale onPress={onPress} scaleTo={PRESS_SCALE.CARD}>
                <View style={styles.card}>
                    <Image
                        source={{ uri: img }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={[
                            COLORS.EFFECTS.ScrimFrom,
                            COLORS.EFFECTS.ScrimTo,
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.text}>
                        {/* Без фолбэка: на картинке весь смысл несёт сама
                            картинка, и слово «Акция» поверх неё лишнее */}
                        {!!label && (
                            <Typography
                                type="caption11"
                                customColor={COLORS.ACCENT.Lime}
                                style={styles.label}
                            >
                                {label}
                            </Typography>
                        )}
                        {/* Текст лежит на тёмном скриме, поэтому белый в обеих
                            темах — TEXT.Invert одинаков в светлой и тёмной. */}
                        <Typography
                            type="num18"
                            color="invert"
                            marginsPaddings={{ mt: 2 }}
                            numberOfLines={2}
                        >
                            {header}
                        </Typography>
                    </View>
                </View>
            </PressableScale>
        )
    }
)
