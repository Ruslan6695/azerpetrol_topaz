import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS, ESCREENS, SIZES } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'
type Props = {
    count: number
}

export const OpenCoffeeBonusScreenFromCoffee = memo(({ count }: Props) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.COFFEE_BONUS)
    }, [])
    return (
        <CustomTouchableOpacity onPress={handlePress} style={styles.container}>
            <View style={styles.left}>
                <Typography color="invert">
                    Кофе в подарок ({count} шт.)
                </Typography>
                <Typography color="invert" type="caption">
                    Выберите и наслаждайтесь вкусом своего любимого напитка
                </Typography>
            </View>
            <View style={styles.right}>
                <Image
                    style={styles.image}
                    source={require('../assets/gift.png')}
                />
            </View>
        </CustomTouchableOpacity>
    )
})

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.BRAND.Primary,
        borderRadius: SIZES.PX * 15,
        padding: SIZES.PX * 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.PX * 10,
        width: '100%',
    },
    left: {
        flex: 1,
    },
    image: {
        width: 60 * SIZES.PX,
        height: 60 * SIZES.PX,
        objectFit: 'contain',
    },
    right: {
        alignItems: 'center',
    },
})
