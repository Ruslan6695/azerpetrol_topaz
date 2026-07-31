import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII } from '../../common/config/constants/RADII'
import { SIZES } from '../../common/config/constants/sizes'
import { ThemeStore } from '../../common/model/themeStore'
import SuccessSvg from '../assets/check.svg'

type Props = {
    width?: number
    height?: number
}

export const SuccessImage = memo(({ width, height }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        container: {
            backgroundColor: COLORS.ACCENT.Lime,
            width: (width ?? 72) * SIZES.PX,
            height: (height ?? 72) * SIZES.PX,
            borderRadius: RADII.PILL,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    return (
        <View style={styles.container}>
            <SuccessSvg
                width={24 * SIZES.PX}
                height={24 * SIZES.PX}
                fill={COLORS.ACCENT.OnLime}
            />
        </View>
    )
})
