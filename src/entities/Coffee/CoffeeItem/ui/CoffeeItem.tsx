import { memo, useCallback, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ICoffeeItem } from '../config/interfaces/ICoffeeItem'
import { COLORS, SIZES, divideNumber } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { NoImageIcon } from '../../../../shared/Icons/NoImageIcon'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
interface IProps extends ICoffeeItem {
    onPress: (coffee: ICoffeeItem) => void
    bonus?: boolean
}

export const CoffeeItem = memo(
    ({ id, name, price, img, onPress, discount, bonus }: IProps) => {
        const discountRub = useMemo(() => {
            if (discount) {
                return price - price * (discount / 100)
            }
            return null
        }, [price, discount])
        const handlePress = useCallback(() => {
            onPress({ id, img, name, price, discount })
        }, [id, img, name, price, onPress, discount])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.6}
                style={styles.container}
            >
                <View style={styles.imageContainer}>
                    {img ? (
                        <Image
                            style={styles.img}
                            width={130 * SIZES.PX}
                            height={130 * SIZES.PX}
                            source={{ uri: img }}
                        />
                    ) : (
                        <NoImageIcon />
                    )}
                </View>
                <CustomText
                    marginsPaddings={{ mt: 10, mb: 10 }}
                    fz={18}
                    fw="600"
                >
                    {name}
                </CustomText>
                {!bonus && (
                    <View style={styles.pricesRow}>
                        <CustomText
                            secondary={!!discountRub}
                            style={{
                                textDecorationLine: !!discountRub
                                    ? 'line-through'
                                    : 'none',
                            }}
                            fz={16}
                            fw="600"
                        >
                            {divideNumber(price)} ₽
                        </CustomText>
                        {discountRub && (
                            <CustomText
                                fz={16}
                                fw="700"
                                color={COLORS.TOAST_ERROR}
                                marginsPaddings={{ ml: 10 }}
                            >
                                {discountRub} ₽
                            </CustomText>
                        )}
                    </View>
                )}
            </CustomTouchableOpacity>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH(1 / 2) - SIZES.PX * 30,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_3,
        height: SIZES.PX * 190,
        borderRadius: SIZES.PX * 20,
        justifyContent: 'center',
    },
    img: {
        objectFit: 'contain',
    },
    pricesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
