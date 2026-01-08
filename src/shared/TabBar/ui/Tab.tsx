import { memo, useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { SIZES } from '../../common/config/constants/sizes'
import { CustomTouchableOpacity } from '../../CustomTouchableOpacity'
import { Typography } from '../../Typography'
import { ITab } from '../config/interfaces/ITab'

interface IProps extends ITab {
    isFirst: boolean
    isLast: boolean
    isSelected: boolean
    onPress: (tab: ITab) => void
}

export const Tab = memo(({ label, value, isSelected, onPress }: IProps) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            paddingVertical: SIZES.PX * 10,
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
            <Typography
                color={!isSelected ? 'tertiary' : undefined}
                type="headlineSmall"
            >
                {label}
            </Typography>
        </CustomTouchableOpacity>
    )
})
