import { memo, useCallback } from 'react'
import { ICoffeeMachineItem } from '../config/interfaces/ICoffeeMachineItem'
import { Image, StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

interface IProps extends ICoffeeMachineItem {
    onPress: (id: number) => void
}

export const CoffeeMachineItem = memo(
    ({ azs_name, id, img, name, onPress }: IProps) => {
        const handlePress = useCallback(() => {
            onPress(id)
        }, [onPress, id])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.container}
            >
                <Image style={styles.img} source={{ uri: img }} />
                <CustomText fz={18} textAlign="center" style={styles.text}>
                    {name}
                </CustomText>
            </CustomTouchableOpacity>
        )
    }
)
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_3,
        padding: SIZES.PX * 10,
        borderRadius: SIZES.PX * 15,
    },
    img: {
        width: SIZES.WIDTH(0.5) - 55 * SIZES.PX,
        height: 150,
        objectFit: 'contain',
    },
    text: {
        maxWidth: SIZES.WIDTH(0.5) - 55 * SIZES.PX,
    },
})
