import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    divideNumber,
    HIDDEN_BALANCE,
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    UserStore,
} from '../../../../shared'
import { AnimatedNumber } from '../../../../shared/AnimatedNumber'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { GlassCard } from '../../../../shared/GlassCard'
import { Typography } from '../../../../shared/Typography'

type Props = {
    balance: number
    bonus_balance: number
    /** Ряд кнопок «Пополнить»/«Перевести». Если не передан — ряда нет вовсе */
    actions?: ReactNode
    /** Кнопка перевода бонусов на счёт, встаёт сразу за числом бонусов */
    bonusAction?: ReactNode
    /** Кнопка «скрыть баланс», встаёт справа от надстрочника */
    visibilityAction?: ReactNode
}

// Карточка баланса из макета: надстрочник, рублёвый баланс, бонусы, действия.
export const BalanceCard = memo(
    ({
        balance,
        bonus_balance,
        actions,
        bonusAction,
        visibilityAction,
    }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const isBalanceHidden = UserStore.useIsBalanceHidden()

        const styles = StyleSheet.create({
            // wrap — страховка на крупные суммы: при шестизначном балансе
            // блок бонусов вместе с кнопкой переносится на строку ниже,
            // а не обрезается краем карточки.
            amountRow: {
                flexDirection: 'row',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: SPACING.SM * SIZES.PX,
            },
            // marginsPaddings у AnimatedNumber нет — отступ держит обёртка.
            amountWrapper: {
                marginTop: SPACING.XS * SIZES.PX,
            },
            amount: {
                letterSpacing: -1 * SIZES.PX,
            },
            // Отступ до «B» даёт сам BonusIcon (ml по умолчанию), отступ
            // перед кнопкой перевода — bonusActionWrapper.
            bonusRow: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            bonusActionWrapper: {
                marginLeft: SPACING.SM * SIZES.PX,
            },
            eyebrowRow: {
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.SM * SIZES.PX,
            },
            actionsRow: {
                flexDirection: 'row',
                gap: 10 * SIZES.PX,
                marginTop: SPACING.XL * SIZES.PX,
            },
        })

        return (
            <GlassCard
                variant="glass2"
                radius={RADII.HERO_SM}
                paddingTop={22}
                paddingHorizontal={SPACING.SCREEN}
                paddingBottom={18}
            >
                <View style={styles.eyebrowRow}>
                    <Typography type="eyebrow">Баланс</Typography>
                    {visibilityAction}
                </View>
                <View style={styles.amountRow}>
                    <View style={styles.amountWrapper}>
                        {isBalanceHidden ? (
                            <Typography type="h2" style={styles.amount}>
                                {HIDDEN_BALANCE.AMOUNT}
                            </Typography>
                        ) : (
                            <AnimatedNumber
                                value={balance}
                                suffix="₽"
                                type="h2"
                                style={styles.amount}
                            />
                        )}
                    </View>
                    <View style={styles.bonusRow}>
                        {isBalanceHidden ? (
                            // Со звёздочками «B» уже внутри строки-заглушки,
                            // отдельная иконка не нужна.
                            <Typography type="num18" color="link">
                                {HIDDEN_BALANCE.BONUS}
                            </Typography>
                        ) : (
                            <>
                                <Typography type="num18" color="link">
                                    {divideNumber(bonus_balance)}
                                </Typography>
                                <BonusIcon
                                    bold
                                    size={18 * SIZES.PX}
                                    color={COLORS.ACCENT.Primary}
                                />
                            </>
                        )}
                        {bonusAction && (
                            <View style={styles.bonusActionWrapper}>
                                {bonusAction}
                            </View>
                        )}
                    </View>
                </View>
                {actions && <View style={styles.actionsRow}>{actions}</View>}
            </GlassCard>
        )
    }
)
