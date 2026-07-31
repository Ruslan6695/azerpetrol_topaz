import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import { WarningIcon } from '../../Icons/WarningIcon/ui/WarningIcon'

type Props = {}

export const WarningImage = memo((props: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.ACCENT.Lime,
            width: 72 * SIZES.PX,
            height: 72 * SIZES.PX,
            borderRadius: RADII.PILL,
        },
    })

    return (
        <View style={styles.container}>
            <WarningIcon />
        </View>
    )
})
