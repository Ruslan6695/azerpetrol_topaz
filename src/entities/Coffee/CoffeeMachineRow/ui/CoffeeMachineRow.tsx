import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import {
    PRESS_SCALE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
} from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'
import { ICoffeeMachineItem } from '../config/interfaces/ICoffeeMachineItem'

interface IProps extends ICoffeeMachineItem {
    onPress: (id: number) => void
}

const THUMB = 48
// Боковой паддинг строки в единицах макета — тот же, что у shared/ListRow.
const ROW_PADDING_HORIZONTAL = 18
const SUBTITLE_MT = 2

// Строка списка кофемашин (dc.html:499–502). Расстояния до точки, которое
// нарисовано в макете, в этом сценарии нет — справа его не рисуем,
// а подписью идёт АЗС, на которой стоит машина.
export const CoffeeMachineRow = memo(
    ({ azs_name, id, img, name, onPress }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()

        const handlePress = useCallback(() => {
            onPress(id)
        }, [onPress, id])

        const styles = StyleSheet.create({
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.MD * SIZES.PX,
            },
            thumb: {
                width: THUMB * SIZES.PX,
                height: THUMB * SIZES.PX,
                borderRadius: RADII.CHIP_SM * SIZES.PX,
                backgroundColor: COLORS.GLASS.Primary,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            },
            img: {
                width: THUMB * SIZES.PX,
                height: THUMB * SIZES.PX,
                objectFit: 'contain',
            },
            titles: {
                flex: 1,
            },
        })

        return (
            <GlassCard
                variant="glass2"
                radius={RADII.ROW}
                paddingVertical={SPACING.XL}
                paddingHorizontal={ROW_PADDING_HORIZONTAL}
                pressScale={PRESS_SCALE.ROW}
                onPress={handlePress}
            >
                <View style={styles.row}>
                    <View style={styles.thumb}>
                        {img ? (
                            <Image style={styles.img} source={{ uri: img }} />
                        ) : (
                            <Icon name="home_coffee" size={26} opacity={0.85} />
                        )}
                    </View>

                    <View style={styles.titles}>
                        <Typography type="rowTitle" numberOfLines={2}>
                            {name}
                        </Typography>
                        {azs_name ? (
                            <Typography
                                type="caption12"
                                color="secondary"
                                marginsPaddings={{ mt: SUBTITLE_MT }}
                            >
                                {azs_name}
                            </Typography>
                        ) : null}
                    </View>
                </View>
            </GlassCard>
        )
    }
)
