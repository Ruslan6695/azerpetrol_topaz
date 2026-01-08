import React from 'react'
import { StyleSheet, View } from 'react-native'
import { COLORS, SIZES } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import MinusIcon from '../assets/minus.svg'
import PlusIcon from '../assets/plus.svg'
import { Typography } from '../../../../shared/Typography'
type Props = {
    liters: number
    onPressOnPlus: () => void
    onPressOnMinus: () => void
}

const ICON_SIZE = 24 * SIZES.PX

export const FuelLitersSelectorLitersBlock = ({
    liters,
    onPressOnMinus,
    onPressOnPlus,
}: Props) => {
    return (
        <View style={styles.container}>
            <CustomTouchableOpacity
                onPress={onPressOnPlus}
                activeOpacity={0.7}
                style={styles.button}
            >
                <PlusIcon width={ICON_SIZE} height={ICON_SIZE} />
            </CustomTouchableOpacity>
            <Typography type="bodyAccentMedium">{liters} л.</Typography>
            <CustomTouchableOpacity
                onPress={onPressOnMinus}
                activeOpacity={0.7}
                style={styles.button}
            >
                <MinusIcon width={ICON_SIZE} height={ICON_SIZE} />
            </CustomTouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 192 * SIZES.PX,
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: COLORS.BACKGROUND.Tertiary,
        height: 44 * SIZES.PX,
        width: 44 * SIZES.PX,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
})
