import React, { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { COLORS, SIZES } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

type Props = {
    liters: number
    currentHeight: number
    onPress: (liters: number) => void
}

export const FuelLitersSelectorTick = memo(
    ({ liters, currentHeight, onPress }: Props) => {
        const handlePress = useCallback(() => {
            onPress(liters)
        }, [liters, onPress])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                style={styles.container}
            >
                <CustomText fz={20} fw="700" color={COLORS.PURPLE}>
                    {liters}
                </CustomText>
            </CustomTouchableOpacity>
        )
    }
)
const styles = StyleSheet.create({
    container: {
        height: 41.6 * SIZES.PX,
        borderTopColor: 'black',
        borderTopWidth: 1,
    },
})
