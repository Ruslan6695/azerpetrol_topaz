import { memo, useCallback } from 'react'
import { ITabWithBackground } from '../config/interfaces/ITabWithBackground'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../CustomText'
import { SIZES } from '../../common/config/constants/sizes'
import { COLORS } from '../../common/config/constants/COLORS'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'

interface IProps extends ITabWithBackground {
    isFirst: boolean
    isLast: boolean
    isSelected: boolean
    onPress: (tab: ITabWithBackground) => void
}

export const TabWithBackground = memo(
    ({ label, value, isFirst, isLast, isSelected, onPress }: IProps) => {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                paddingVertical: SIZES.PX * 15,
                backgroundColor: isSelected ? COLORS.GREEN_2 : COLORS.GRAY_2,
                borderTopLeftRadius: isFirst ? 10 * SIZES.PX : undefined,
                borderBottomLeftRadius: isFirst ? 10 * SIZES.PX : undefined,
                borderTopRightRadius: isLast ? 10 * SIZES.PX : undefined,
                borderBottomRightRadius: isLast ? 10 * SIZES.PX : undefined,
            },
        })
        const handlePress = useCallback(() => {
            onPress({ label, value })
        }, [value, label, onPress])
        return (
            <CustomTouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.container}
            >
                <CustomText fw="500" white={isSelected}>
                    {label.toUpperCase()}
                </CustomText>
            </CustomTouchableOpacity>
        )
    }
)
