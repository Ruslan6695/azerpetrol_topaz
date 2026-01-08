import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS } from '../../common/config/constants/COLORS'
import { SIZES } from '../../common/config/constants/sizes'
import { WarningIcon } from '../../Icons/WarningIcon/ui/WarningIcon'

type Props = {}

export const WarningImage = memo((props: Props) => {
    return (
        <View style={styles.container}>
            <WarningIcon />
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.BRAND.Primary,
        width: 72 * SIZES.PX,
        height: 72 * SIZES.PX,
        borderRadius: 999,
    },
})
