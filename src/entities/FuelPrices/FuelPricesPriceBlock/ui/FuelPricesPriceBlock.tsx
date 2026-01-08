import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, ThemeStore } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { Typography } from '../../../../shared/Typography'
import { IFuelPricesPriceBlock } from '../config/interfaces/IFuelPricesPriceBlock'

interface IProps extends IFuelPricesPriceBlock {}

export const FuelPricesPriceBlock = memo(
    ({ id, name, price, bonus, discount }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const discountPrice = useMemo(() => {
            if (discount) {
                if (discount.type === 'percent') {
                    return (price - price * (discount.value / 100)).toFixed(2)
                } else {
                    return (price - discount.value).toFixed(2)
                }
            }
        }, [discount, price])
        const styled = StyleSheet.create({
            container: {
                width: SIZES.WIDTH(0.42),
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                padding: SIZES.PX * 10,
                borderRadius: 10 * SIZES.PX,
            },
            top: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
        })

        return (
            <View style={styled.container}>
                <View style={styled.top}>
                    <Typography>{name}</Typography>
                    <Typography>{price.toFixed(2)} ₽</Typography>
                </View>
                {discount ? (
                    <MPLayout mt={5 * SIZES.PX}>
                        <View style={styled.top}>
                            <Typography type="caption">Со скидкой</Typography>
                            <Typography type="bodyAccentSmall" color="error">
                                {discountPrice} ₽
                            </Typography>
                        </View>
                    </MPLayout>
                ) : null}
                {bonus ? (
                    <MPLayout mt={5 * SIZES.PX}>
                        <View style={styled.top}>
                            <Typography type="caption">Кэшбек</Typography>
                            <Typography type="bodyAccentSmall" color="success">
                                {bonus.value}{' '}
                                {bonus.type === 'rubles' ? '₽' : '%'}
                            </Typography>
                        </View>
                    </MPLayout>
                ) : null}
            </View>
        )
    }
)
