import { memo, useMemo } from 'react'
import { EHistoryItemType } from '../../config/enums/EHistoryItemType'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'

type Props = {
    type: EHistoryItemType
}

export const HistoryDetailsTitle = memo(({ type }: Props) => {
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
    const styles = StyleSheet.create({
        container: {
            borderColor:
                type === EHistoryItemType.PAY_BALANCE
                    ? COLORS.GREEN
                    : COLORS.RED,
            paddingVertical: SIZES.PX * 10,
            paddingHorizontal: SIZES.PX * 10,
            borderWidth: 1 * SIZES.PX,
            borderRadius: SIZES.PX * 20,
        },
    })
    return (
        <View style={styles.container}>
            <CustomText
                fz={12}
                color={
                    type === EHistoryItemType.PAY_BALANCE
                        ? COLORS.GREEN
                        : COLORS.RED
                }
            >
                {title}
            </CustomText>
        </View>
    )
})
