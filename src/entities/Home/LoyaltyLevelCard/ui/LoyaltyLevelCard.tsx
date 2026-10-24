import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { divideNumber, RADII, SIZES, SPACING } from '../../../../shared'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'

type Props = {
    // Название уровня — название группы клиента.
    name: string
    spent: number
    // null — уровень высший или закреплён вручную: «до следующего» не показываем.
    nextName: string | null
    nextThreshold: number | null
}

// Уровень лояльности клиента под балансом на главном (уровни — панель →
// «Клиенты» → «Группы» → «Уровни»). Только отображение, данные — из home.
export const LoyaltyLevelCard = memo(
    ({ name, spent, nextName, nextThreshold }: Props) => {
        const left =
            nextName !== null && nextThreshold !== null
                ? Math.max(0, Math.ceil(nextThreshold - spent))
                : null

        const styles = StyleSheet.create({
            content: {
                gap: SPACING.XS * SIZES.PX,
            },
        })

        return (
            <GlassCard
                variant="glass"
                radius={RADII.CARD}
                paddingTop={14}
                paddingHorizontal={SPACING.SCREEN}
                paddingBottom={14}
            >
                <View style={styles.content}>
                    <Typography type="eyebrow">Ваш уровень</Typography>
                    <Typography type="num18">{name}</Typography>
                    {left !== null && (
                        <Typography type="body13" color="secondary">
                            {`До «${nextName}» осталось ${divideNumber(left)} ₽`}
                        </Typography>
                    )}
                </View>
            </GlassCard>
        )
    }
)
