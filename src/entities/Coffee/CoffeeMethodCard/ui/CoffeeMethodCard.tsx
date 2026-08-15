import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { PRESS_SCALE, RADII, SIZES, SPACING } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Icon, TIconName } from '../../../../shared/Icons'
import { Typography } from '../../../../shared/Typography'

type Props = {
    icon: TIconName
    title: string
    subtitle: string
    onPress: () => void
}

// Паддинг карточки в единицах макета — GlassCard домножает на SIZES.PX сам.
// Значение из макета, промежуточное между SPACING.XL и SPACING.SCREEN.
const CARD_PADDING = 18
const SUBTITLE_MT = 2

// Крупная карточка-действие на вкладке «Купить» (dc.html:237–238):
// заголовок с подписью слева, иконка справа.
export const CoffeeMethodCard = memo(
    ({ icon, title, subtitle, onPress }: Props) => {
        const styles = StyleSheet.create({
            row: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: SPACING.MD * SIZES.PX,
            },
            titles: {
                flex: 1,
            },
        })

        return (
            <GlassCard
                variant="glass2"
                radius={RADII.CARD}
                padding={CARD_PADDING}
                pressScale={PRESS_SCALE.CARD}
                onPress={onPress}
            >
                <View style={styles.row}>
                    <View style={styles.titles}>
                        <Typography type="label16">{title}</Typography>
                        <Typography
                            type="caption12"
                            color="secondary"
                            marginsPaddings={{ mt: SUBTITLE_MT }}
                        >
                            {subtitle}
                        </Typography>
                    </View>
                    <Icon name={icon} size={32} />
                </View>
            </GlassCard>
        )
    }
)
