import { ReactElement, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'

type Props = {
    bgColor: string
    icon: ReactElement
    onPress: () => void
    title: string
    textDark?: boolean
}

export const FuelMainBlock = memo(
    ({ bgColor, icon: Icon, onPress, title, textDark }: Props) => {
        const styles = StyleSheet.create({
            container: {
                backgroundColor: bgColor,
                flex: 1,

                borderRadius: 20 * SIZES.PX,
                paddingHorizontal: SIZES.PX * 20,
                paddingVertical: SIZES.PX * 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },

            icon: {
                transform: [{ rotate: '10deg' }],
            },
        })
        return (
            <CustomTouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.container}
            >
                <CustomText
                    style={{ maxWidth: 170 * SIZES.PX }}
                    fz={20}
                    fw="600"
                    white={!textDark}
                >
                    {title}
                </CustomText>
                <View style={styles.icon}>{Icon}</View>
            </CustomTouchableOpacity>
        )
    }
)

const styles = StyleSheet.create({
    container: {},
})
