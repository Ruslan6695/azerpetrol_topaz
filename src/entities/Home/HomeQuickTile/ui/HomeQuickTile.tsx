import { memo } from 'react'
import { StyleSheet } from 'react-native'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon, TIconName } from '../../../../shared/Icons'
import { PressableScale } from '../../../../shared/PressableScale'
import { Typography } from '../../../../shared/Typography'

type Props = {
    icon: TIconName
    title: string
    subtitle?: string
    onPress: () => void
}

// Плитка сетки 2×2 на главной. Ширина считается от паддинга 20 у (main)/_layout
// и gap 12 между колонками: (W − 2×20 − 12) / 2 = W/2 − 26.
//
// floor обязателен: точное значение упирается в доступную ширину впритык
// (запас порядка сотой пункта), и субпиксельное округление уводит вторую
// плитку на следующую строку — сетка разваливается в столбик.
const TILE_WIDTH = Math.floor(SIZES.WIDTH(0.5) - 26 * SIZES.PX)

export const HomeQuickTile = memo(
    ({ icon, title, subtitle, onPress }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        const styles = StyleSheet.create({
            tile: {
                // Ширина на внешнем элементе: во flex-строке позицию занимает
                // именно PressableScale, а не GlassCard внутри него.
                width: TILE_WIDTH,
            },
            card: {
                minHeight: 118 * SIZES.PX,
            },
        })

        return (
            // PressableScale снаружи, а не onPress у GlassCard: карточке нужен
            // отклик плитки (0.95), а GlassCard навязывает отклик карточки (0.97).
            <PressableScale
                onPress={onPress}
                scaleTo={PRESS_SCALE.TILE}
                style={styles.tile}
            >
                <GlassCard
                    variant="glass"
                    radius={RADII.CARD}
                    padding={SPACING.XL}
                    style={styles.card}
                >
                    <Icon
                        name={icon}
                        size={34}
                        color={COLORS.Icon.Primary}
                        opacity={0.9}
                    />
                    <Typography
                        type="rowTitle"
                        marginsPaddings={{ mt: SPACING.MD }}
                        numberOfLines={2}
                    >
                        {title}
                    </Typography>
                    {!!subtitle && (
                        <Typography
                            type="caption11"
                            color="secondary"
                            marginsPaddings={{ mt: 2 }}
                            numberOfLines={2}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </GlassCard>
            </PressableScale>
        )
    }
)
