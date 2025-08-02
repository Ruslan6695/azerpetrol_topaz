import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../shared'
import { CustomText } from '../../../shared/CustomText'

type Props = {
    type: 'purple' | 'gray'
    leftText: string
    rightText: string
    rightFz?: number
    rightFlexDisabled?: boolean
}

export const SplitedInfoBlock = memo(
    ({ type, leftText, rightText, rightFz, rightFlexDisabled }: Props) => {
        const styles = StyleSheet.create({
            container: {
                width: '100%',
                flexDirection: 'row',
            },
            left: {
                backgroundColor:
                    type === 'purple' ? COLORS.PURPLE_2 : COLORS.GRAY,
                flex: 2,
                padding: SIZES.PX * 10,
                justifyContent: 'center',
                borderTopLeftRadius: SIZES.PX * 10,
                borderBottomLeftRadius: SIZES.PX * 10,
            },
            right: {
                backgroundColor:
                    type === 'purple' ? COLORS.PURPLE : COLORS.GRAY_1,
                flex: rightFlexDisabled ? 0 : 1,
                padding: SIZES.PX * 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: SIZES.PX * 10,
                borderBottomRightRadius: SIZES.PX * 10,
            },
        })
        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    <CustomText fw="600" fz={20} white>
                        {leftText.toUpperCase()}
                    </CustomText>
                </View>
                <View style={styles.right}>
                    <CustomText fw="600" fz={rightFz ? rightFz : 20} white>
                        {rightText.toUpperCase()}
                    </CustomText>
                </View>
            </View>
        )
    }
)
