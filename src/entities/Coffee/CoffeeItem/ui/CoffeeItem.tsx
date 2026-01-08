import { memo, useCallback, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS, SIZES, divideNumber } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { NoImageIcon } from '../../../../shared/Icons/NoImageIcon'
import { Typography } from '../../../../shared/Typography'
import { ICoffeeItem } from '../config/interfaces/ICoffeeItem'
import { BonusIcon } from '../../../../shared/BonusIcon'
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
                <Typography marginsPaddings={{ mb: 12 }} type="displaySmall">
                    {name}
                </Typography>
                {!bonus && (
                    <View style={styles.pricesRow}>
                        <View style={styles.pricesRow}>
                            <Typography
                                type="bodyAccentSmall"
                                style={{
                                    textDecorationLine: !!discountRub
                                        ? 'line-through'
                                        : 'none',
                                }}
                            >
                                {divideNumber(price)}
                            </Typography>
                            <BonusIcon />
                        </View>

                        {discountRub && (
                            <View style={styles.pricesRow}>
                                <Typography
                                    type="bodyAccentSmall"
                                    color={'error'}
                                    marginsPaddings={{ ml: 10 }}
                                >
                                    {discountRub}
                                </Typography>
                                <BonusIcon color={COLORS.TEXT.Error} />
                            </View>
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
        backgroundColor: '#F8F8F8',
        height: SIZES.PX * 165,
        borderRadius: SIZES.PX * 16,
        justifyContent: 'center',
        marginBottom: SIZES.PX * 10,
    },
    img: {
        objectFit: 'contain',
    },
    pricesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
