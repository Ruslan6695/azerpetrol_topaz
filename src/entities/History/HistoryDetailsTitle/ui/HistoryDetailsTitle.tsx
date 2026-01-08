import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, ThemeStore } from '../../../../shared'
import { Typography } from '../../../../shared/Typography'
import { EHistoryItemType } from '../../config/enums/EHistoryItemType'

type Props = {
    type: EHistoryItemType
}

export const HistoryDetailsTitle = memo(({ type }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const title = useMemo<string>(() => {
        switch (type) {
            case EHistoryItemType.PAY_BALANCE:
                return 'Поступление '
            case EHistoryItemType.BUY_COFFEE:
                return 'Покупка кофе'
            case EHistoryItemType.BUY_ON_CASH:
                return 'Покупка на кассе'
            case EHistoryItemType.FUEL_FILLING:
                return 'Налив топлива'
            case EHistoryItemType.TRANSFER_BALANCE:
                return 'Перевод пользователю'
        }
    }, [type])
    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    borderColor:
                        type === EHistoryItemType.PAY_BALANCE
                            ? COLORS.SUCCESS.Secondary
                            : COLORS.ERROR.Secondary,
                    paddingVertical: SIZES.PX * 10,
                    paddingHorizontal: SIZES.PX * 10,
                    borderWidth: 1 * SIZES.PX,
                    borderRadius: SIZES.PX * 20,
                },
            }),
        [COLORS]
    )
    return (
        <View style={styles.container}>
            <Typography
                type="caption"
                color={
                    type === EHistoryItemType.PAY_BALANCE ? 'success' : 'error'
                }
            >
                {title}
            </Typography>
        </View>
    )
})
