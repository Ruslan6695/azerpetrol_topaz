import { memo, useCallback, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import {
    RADII,
    SIZES,
    SPACING,
    ThemeStore,
    divideNumber,
    useSendFetch,
} from '../../../../shared'
import { BonusIcon } from '../../../../shared/BonusIcon'
import { Icon } from '../../../../shared/Icons'
import { PillButton } from '../../../../shared/PillButton'
import { Typography } from '../../../../shared/Typography'
import { buySelectCoffeeApi } from '../api/buySelectCoffeeApi'
import { IBuySelectCoffeeArgs } from '../config/interfaces/IBuySelectCoffeeArgs'
import { TCoffeePurchaseType } from '../config/types/TCoffeePurchaseType'

type Props = {
    coffee: ICoffeeItem
    type: TCoffeePurchaseType
    coffeeMachineId: number
    onSuccess: () => void
    onCancel: () => void
}

// Размеры центрированного состояния из макета (dc.html:615–623).
const CIRCLE = 96
const ACTION_WIDTH = 240

// Шаг подтверждения заказа. В макете это отдельный push-экран; в коде —
// состояние внутри роута /coffee, поэтому шапку даёт StepHeader снаружи.
export const ConfirmCoffeePurchase = memo(
    ({ coffee, type, coffeeMachineId, onSuccess, onCancel }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const { isSendFetchLoading, sendFetch } =
            useSendFetch<IBuySelectCoffeeArgs>({
                apiCallback: buySelectCoffeeApi.buy,
                errorText:
                    type === 'buy'
                        ? 'Ошибка при покупке кофе'
                        : 'Ошибка при выборе кофе',
            })

        const discountRub = useMemo(() => {
            if (!coffee.discount) {
                return null
            }
            // divideNumber делит на разряды посимвольно и на дробях ломается —
            // форматируем только целые.
            const value =
                Math.round(coffee.price * (1 - coffee.discount / 100) * 100) /
                100
            return Number.isInteger(value) ? divideNumber(value) : String(value)
        }, [coffee.price, coffee.discount])

        const handleSubmit = useCallback(() => {
            sendFetch({
                args: {
                    bonus: type === 'bonus' ? 1 : 0,
                    productId: coffee.id,
                    coffee_machine_id: coffeeMachineId,
                },
                afterDataCallback() {
                    onSuccess()
                },
            })
        }, [coffee.id, type, coffeeMachineId, onSuccess, sendFetch])

        const styles = StyleSheet.create({
            container: {
                alignItems: 'center',
                gap: SPACING.XL * SIZES.PX,
                paddingTop: 40 * SIZES.PX,
            },
            circle: {
                width: CIRCLE * SIZES.PX,
                height: CIRCLE * SIZES.PX,
                borderRadius: RADII.PILL,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.GLASS.Secondary,
                borderWidth: 1,
                borderColor: COLORS.GLASS.Border,
                overflow: 'hidden',
            },
            img: {
                width: (CIRCLE - 16) * SIZES.PX,
                height: (CIRCLE - 16) * SIZES.PX,
                objectFit: 'contain',
            },
            details: {
                alignItems: 'center',
                gap: SPACING.SM * SIZES.PX,
                maxWidth: 260 * SIZES.PX,
            },
            pricesRow: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            priceGroup: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            oldPrice: {
                textDecorationLine: 'line-through',
            },
            actions: {
                gap: SPACING.ROW_GAP * SIZES.PX,
                alignItems: 'center',
            },
            action: {
                width: ACTION_WIDTH * SIZES.PX,
                alignSelf: 'center',
            },
        })

        return (
            <View style={styles.container}>
                <View style={styles.circle}>
                    {coffee.img ? (
                        <Image
                            style={styles.img}
                            source={{ uri: coffee.img }}
                        />
                    ) : (
                        <Icon name="home_coffee" size={44} />
                    )}
                </View>

                <Typography type="h6" textAlign="center">
                    Подтвердите заказ
                </Typography>

                <View style={styles.details}>
                    <Typography
                        type="body13"
                        color="secondary"
                        textAlign="center"
                    >
                        {coffee.name}
                    </Typography>

                    {type === 'buy' && (
                        <View style={styles.pricesRow}>
                            <View style={styles.priceGroup}>
                                <Typography
                                    type={discountRub ? 'caption12' : 'num16'}
                                    color={
                                        discountRub ? 'secondary' : undefined
                                    }
                                    style={
                                        discountRub
                                            ? styles.oldPrice
                                            : undefined
                                    }
                                >
                                    {divideNumber(coffee.price)}
                                </Typography>
                                <BonusIcon
                                    size={(discountRub ? 12 : 15) * SIZES.PX}
                                    color={
                                        discountRub
                                            ? COLORS.TEXT.Secondary
                                            : COLORS.TEXT.Primary
                                    }
                                />
                            </View>

                            {discountRub !== null && (
                                <View style={styles.priceGroup}>
                                    <Typography
                                        type="num16"
                                        customColor={COLORS.STATE.Destructive}
                                        marginsPaddings={{ ml: SPACING.SM }}
                                    >
                                        {discountRub}
                                    </Typography>
                                    <BonusIcon
                                        size={15 * SIZES.PX}
                                        color={COLORS.STATE.Destructive}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>

                <View style={styles.actions}>
                    <PillButton
                        title={type === 'bonus' ? 'Получить' : 'Купить'}
                        loading={isSendFetchLoading}
                        onPress={handleSubmit}
                        fullWidth={false}
                        style={styles.action}
                    />
                    <PillButton
                        title="Отмена"
                        variant="secondary"
                        size="md"
                        disabled={isSendFetchLoading}
                        onPress={onCancel}
                        fullWidth={false}
                        style={styles.action}
                    />
                </View>
            </View>
        )
    }
)
