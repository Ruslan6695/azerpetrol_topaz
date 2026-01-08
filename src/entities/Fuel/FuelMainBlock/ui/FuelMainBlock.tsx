import { ReactElement, memo } from 'react'
import { StyleSheet } from 'react-native'
import { SIZES, ThemeStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'

type Props = {
    icon: ReactElement
    onPress: () => void
    title: string
}

export const FuelMainBlock = memo(({ icon: Icon, onPress, title }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.BACKGROUND.Tertiary,
            borderRadius: 16 * SIZES.PX,
            padding: SIZES.PX * 16,
            paddingVertical: 12 * SIZES.PX,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: COLORS.BRAND.Secondary,
            borderWidth: 0.9 * SIZES.PX,
        },
    })
    return (
        <CustomTouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.container}
        >
            <Typography type="displaySmall">{title}</Typography>
            {Icon}
        </CustomTouchableOpacity>
    )
})

const styles = StyleSheet.create({
    container: {},
})
