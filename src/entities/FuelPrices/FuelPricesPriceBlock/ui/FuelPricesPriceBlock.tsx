import { memo, useMemo } from 'react'
import { StyleSheet, View, ViewBase } from 'react-native'
import { IFuelPricesPriceBlock } from '../config/interfaces/IFuelPricesPriceBlock'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'

interface IProps extends IFuelPricesPriceBlock {}

export const FuelPricesPriceBlock = memo(
    ({ id, name, price, bonus, discount }: IProps) => {
        const discountPrice = useMemo(() => {
            if (discount) {
                if (discount.type === 'percent') {
                    return (price - price * (discount.value / 100)).toFixed(2)
                } else {
                    return (price - discount.value).toFixed(2)
                }
            }
        }, [discount, price])
        return (
            <View style={styled.container}>
                <View style={styled.top}>
                    <CustomText>{name}</CustomText>
                    <CustomText fz={14}>{price.toFixed(2)} ₽</CustomText>
                </View>
                {discount ? (
                    <MPLayout mt={5 * SIZES.PX}>
                        <View style={styled.top}>
                            <CustomText fz={12}>Со скидкой</CustomText>
                            <CustomText fz={14} color={COLORS.RED} fw="600">
                                {discountPrice} ₽
                            </CustomText>
                        </View>
                    </MPLayout>
                ) : null}
                {bonus ? (
                    <MPLayout mt={5 * SIZES.PX}>
                        <View style={styled.top}>
                            <CustomText fz={12}>Кэшбек</CustomText>
                            <CustomText fz={14} color={COLORS.GREEN} fw="700">
                                {bonus.value}{' '}
                                {bonus.type === 'rubles' ? '₽' : '%'}
                            </CustomText>
                        </View>
                    </MPLayout>
                ) : null}
            </View>
        )
    }
)

const styled = StyleSheet.create({
    container: {
        width: SIZES.WIDTH(0.42),
        backgroundColor: COLORS.GRAY_2,
        padding: SIZES.PX * 10,
        borderRadius: 10 * SIZES.PX,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
