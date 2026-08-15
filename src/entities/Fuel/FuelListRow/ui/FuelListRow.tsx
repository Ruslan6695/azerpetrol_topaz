import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { PRESS_SCALE, RADII, SIZES, SPACING } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'

type Props = {
    /** Идентификатор элемента: возвращается в onSelect, чтобы не плодить
     *  стрелочные функции в списке и не ломать memo строк */
    id: number
    title: string
    subtitle?: string
    /** Значение справа: расстояние, номер, статус */
    value?: string
    onSelect: (id: number) => void
}

// Стеклянная строка списка макета (dc.html:499–502): заголовок, подпись
// и значение справа. Используется списками АЗС и колонок.
export const FuelListRow = memo(
    ({ id, title, subtitle, value, onSelect }: Props) => {
        const handlePress = useCallback(() => {
            onSelect(id)
        }, [id, onSelect])

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
                radius={RADII.ROW}
                paddingVertical={SPACING.XL}
                paddingHorizontal={18}
                pressScale={PRESS_SCALE.ROW}
                onPress={handlePress}
            >
                <View style={styles.row}>
                    <View style={styles.titles}>
                        <Typography type="rowTitle" numberOfLines={2}>
                            {title}
                        </Typography>
                        {subtitle ? (
                            <Typography
                                type="caption12"
                                color="secondary"
                                marginsPaddings={{ mt: 2 }}
                            >
                                {subtitle}
                            </Typography>
                        ) : null}
                    </View>
                    {value ? (
                        <Typography type="label13" color="secondary">
                            {value}
                        </Typography>
                    ) : null}
                </View>
            </GlassCard>
        )
    }
)
