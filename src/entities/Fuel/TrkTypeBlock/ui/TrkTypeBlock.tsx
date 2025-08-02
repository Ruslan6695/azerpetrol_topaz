import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, ITrkType, SIZES, divideNumber } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

interface IProps extends ITrkType {
    onPress: (trkType: ITrkType) => void
    isSelected: boolean
}

export const TrkTypeBlock = memo(
    ({
        id,
        name,
        price,
        onPress,
        isSelected,
        nozzle_id,
        art,
        petrol_id,
    }: IProps) => {
        const handlePress = useCallback(() => {
            onPress({ id, name, price, nozzle_id, art, petrol_id })
        }, [onPress, id, name, price])

        const styles = StyleSheet.create({
            container: {
                backgroundColor: isSelected ? COLORS.GREEN_2 : COLORS.GRAY,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: SIZES.PX * 12,
                borderRadius: SIZES.PX * 10,
            },
        })
        return (
            <CustomTouchableOpacity
                activeOpacity={0.7}
                onPress={handlePress}
                style={styles.container}
            >
                <CustomText fz={22} white>
                    {name.toUpperCase()}
                </CustomText>
                <CustomText fz={22} white>
                    {divideNumber(price)} ₽
                </CustomText>
            </CustomTouchableOpacity>
        )
    }
)
