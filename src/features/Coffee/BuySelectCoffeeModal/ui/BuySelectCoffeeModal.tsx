import { memo, useCallback, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { COLORS, SIZES, divideNumber, useSendFetch } from '../../../../shared'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomText } from '../../../../shared/CustomText'
import { Loader } from '../../../../shared/Loader'
import { buySelectCoffeeApi } from '../api/buySelectCoffeeApi'

type Props = {
    handleClose: () => void
    isOpened: boolean
    coffee: ICoffeeItem
    type: 'bonus' | 'buy'
    onSubmit?: () => void
    coffeeMachineId: number
}

export const BuySelectCoffeeModal = memo(
    ({
        handleClose,
        isOpened,
        coffee,
        type,
        onSubmit,
        coffeeMachineId,
    }: Props) => {
        const { errorText, isSendFetchLoading, sendFetch } = useSendFetch<{
            productId: number
            bonus: 0 | 1
            coffee_machine_id: number
        }>({
            apiCallback: buySelectCoffeeApi.buy,
            errorText:
                type === 'buy'
                    ? 'Ошибка при покупке кофе'
                    : 'Ошибка при выборе кофе',
        })

        const coffeeDiscount = useMemo(() => {
            if (coffee && coffee?.discount) {
                return coffee.price - coffee.price * (coffee.discount / 100)
            }
            return null
        }, [coffee])
        const handleSubmit = useCallback(() => {
            sendFetch({
                args: {
                    bonus: type === 'bonus' ? 1 : 0,
                    productId: coffee.id,
                    coffee_machine_id: coffeeMachineId,
                },
                afterDataCallback(data) {
                    onSubmit?.()
                },
                finalyCallback() {
                    handleClose()
                },
            })
        }, [coffee, type, onSubmit, coffeeMachineId])

        return (
            <BottomSheet
                hideDisabled
                bgDark
                closeOnPressOutside
                bottomPx={180}
                isOpened={isOpened}
                handleClose={handleClose}
            >
                <View style={styles.container}>
                    {isSendFetchLoading ? (
                        <Loader marginsPaddings={{ mt: 100 }} />
                    ) : (
                        <>
                            <View style={styles.topRow}>
                                <CustomButton
                                    onPress={handleClose}
                                    styled={{
                                        type: 'OUTLINED',
                                        width: { type: 'px', value: 110 },
                                        height: { type: 'px', value: 45 },
                                        fz: 15,
                                    }}
                                >
                                    Отменить
                                </CustomButton>
                                <CustomButton
                                    onPress={handleSubmit}
                                    styled={{
                                        type: 'SUCCES',
                                        width: { type: 'px', value: 110 },
                                        height: { type: 'px', value: 45 },
                                        fz: 15,
                                    }}
                                >
                                    {type === 'bonus' ? 'Выбрать' : 'Купить'}
                                </CustomButton>
                            </View>

                            {coffee?.img && (
                                <Image
                                    style={styles.img}
                                    width={150 * SIZES.PX}
                                    height={150 * SIZES.PX}
                                    source={{ uri: coffee.img }}
                                />
                            )}
                            <CustomText
                                marginsPaddings={{ mt: 10, mb: 10 }}
                                fw="600"
                                fz={18}
                            >
                                {coffee?.name}
                            </CustomText>
                            {type === 'buy' && (
                                <View style={styles.coffeePricesRow}>
                                    <CustomText
                                        secondary={!!coffeeDiscount}
                                        style={{
                                            textDecorationLine: !!coffeeDiscount
                                                ? 'line-through'
                                                : 'none',
                                        }}
                                        fz={18}
                                        fw="600"
                                    >
                                        {divideNumber(coffee?.price)} ₽
                                    </CustomText>
                                    {coffeeDiscount && (
                                        <CustomText
                                            fz={18}
                                            fw="700"
                                            color={COLORS.TOAST_ERROR}
                                            marginsPaddings={{ ml: 10 }}
                                        >
                                            {coffeeDiscount} ₽
                                        </CustomText>
                                    )}
                                </View>
                            )}
                        </>
                    )}
                </View>
            </BottomSheet>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        padding: SIZES.PX * 20,
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_3,
        borderTopLeftRadius: SIZES.PX * 40,
        borderTopRightRadius: SIZES.PX * 40,
        height: '100%',
        marginBottom: 30,
    },
    topRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        marginBottom: SIZES.PX * 20,
    },
    coffeePricesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    img: {
        objectFit: 'contain',
    },
})
