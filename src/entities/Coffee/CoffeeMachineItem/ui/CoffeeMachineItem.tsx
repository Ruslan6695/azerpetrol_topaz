import { memo, useCallback, useMemo } from 'react'
import { ICoffeeMachineItem } from '../config/interfaces/ICoffeeMachineItem'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS, SIZES, ThemeStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'

interface IProps extends ICoffeeMachineItem {
    onPress: (id: number) => void
}

export const CoffeeMachineItem = memo(
    ({ azs_name, id, img, name, onPress }: IProps) => {
        const COLORS = ThemeStore.useCOLORS()
        const handlePress = useCallback(() => {
            onPress(id)
        }, [onPress, id])

        const styles = useMemo(
            () =>
                StyleSheet.create({
                    container: {
                        alignItems: 'center',
                        backgroundColor: COLORS.BACKGROUND.Tertiary,
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
                }),
            [COLORS]
        )
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.container}
            >
                <Image style={styles.img} source={{ uri: img }} />
                <Typography textAlign="center" style={styles.text}>
                    {name}
                </Typography>
            </CustomTouchableOpacity>
        )
    }
)
