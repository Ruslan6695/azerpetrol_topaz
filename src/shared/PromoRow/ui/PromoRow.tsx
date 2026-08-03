import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { SPACING } from '../../common/config/constants/SPACING'
import { ThemeStore } from '../../common/model/themeStore'
import { GlassCard } from '../../GlassCard'
import { Icon, TIconName } from '../../Icons'
import { Typography } from '../../Typography'

type Props = {
    icon: TIconName
    /** Надстрочник лаймом: «АКЦИЯ», «КОФЕ В ПОДАРОК» */
    label: string
    title: string
    onPress: () => void
}

// Лаймовая промо-строка из макета: иконка → надстрочник и заголовок → стрелка.
export const PromoRow = memo(({ icon, label, title, onPress }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
        },
        content: {
            flex: 1,
        },
        label: {
            textTransform: 'uppercase',
            letterSpacing: 0.4 * SIZES.PX,
        },
    })

    return (
        <GlassCard
            variant="lime"
            radius={RADII.CARD}
            paddingVertical={SPACING.XL}
            paddingHorizontal={18}
            onPress={onPress}
        >
            <View style={styles.row}>
                <Icon name={icon} size={30} />
                <View style={styles.content}>
                    <Typography
                        type="caption11"
                        customColor={COLORS.ACCENT.Primary}
                        style={styles.label}
                    >
                        {label}
                    </Typography>
                    <Typography
                        type="rowTitle"
                        marginsPaddings={{ mt: 2 }}
                        numberOfLines={2}
                    >
                        {title}
                    </Typography>
                </View>
                <Typography type="num15" color="secondary">
                    →
                </Typography>
            </View>
        </GlassCard>
    )
})
