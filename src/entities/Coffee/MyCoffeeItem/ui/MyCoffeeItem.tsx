import { memo, useCallback } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { IMyCoffeeItem } from '../config/interfaces/IMyCoffeeItem'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES } from '../../../../shared'
import { NoImageIcon } from '../../../../shared/Icons/NoImageIcon'
import { MPLayout } from '../../../../shared/MpLayout'

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
                backgroundColor: isSelected ? COLORS.GREEN_2 : COLORS.GRAY_3,
                width: '100%',
                padding: SIZES.PX * 10,
                borderRadius: SIZES.PX * 10,
                flexDirection: 'row',
                alignItems: 'center',
            },
            imageContainer: {
                backgroundColor: COLORS.GRAY_3,
                borderRadius: SIZES.PX * 8,
                justifyContent:'center',
                alignItems:'center'
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
                            <NoImageIcon width={45} height={45} />
                        )}
                    </View>
                </MPLayout>
                <CustomText white={isSelected} fw="500" fz={16}>
                    {name}
                </CustomText>
            </CustomTouchableOpacity>
        )
    }
)
