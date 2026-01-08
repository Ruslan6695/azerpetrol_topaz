import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { NoImageIcon } from '../../../../shared/Icons/NoImageIcon'
import { MPLayout } from '../../../../shared/MpLayout'
import { Typography } from '../../../../shared/Typography'
import { IMyCoffeeItem } from '../config/interfaces/IMyCoffeeItem'

interface IProps extends IMyCoffeeItem {
    onPress: (coffee: IMyCoffeeItem) => void
    isSelected: boolean
}
export const MyCoffeeItem = memo(
    ({ id, img, name, onPress, qr, isSelected }: IProps) => {
        const handlePress = useCallback(() => {
            onPress({ id, img, name, qr })
        }, [id, onPress])
        const styles = StyleSheet.create({
            container: {
                backgroundColor: isSelected ? COLORS.BRAND.Primary : undefined,
                width: '100%',
                padding: SIZES.PX * 10,
                borderRadius: SIZES.PX * 10,
                flexDirection: 'row',
                alignItems: 'center',
            },
            imageContainer: {
                backgroundColor: COLORS.BACKGROUND.Tertiary,
                borderRadius: SIZES.PX * 8,
                justifyContent: 'center',
                alignItems: 'center',
                width: 48 * SIZES.PX,
                height: 48 * SIZES.PX,
            },
            image: {
                objectFit: 'contain',
                width: SIZES.PX * 45,
                height: SIZES.PX * 45,
            },
        })
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.6}
                style={styles.container}
            >
                <MPLayout mr={15}>
                    <View style={styles.imageContainer}>
                        {img ? (
                            <Image style={styles.image} source={{ uri: img }} />
                        ) : (
                            <NoImageIcon width={48} height={48} />
                        )}
                    </View>
                </MPLayout>
                <Typography color={isSelected ? 'invert' : undefined}>
                    {name}
                </Typography>
            </CustomTouchableOpacity>
        )
    }
)
