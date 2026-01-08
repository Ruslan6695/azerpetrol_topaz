import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { ESCREENS, SIZES, ThemeStore } from '../../../../shared'
import { CustomTouchableOpacity } from '../../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../../shared/Typography'

type Props = {}

export const OpenTransferBalanceScreen = (props: Props) => {
    const router = useRouter()
    const COLORS = ThemeStore.useCOLORS()
    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    backgroundColor: COLORS.BACKGROUND.Tertiary,
                    padding: SIZES.PX * 16,
                    borderRadius: SIZES.PX * 16,
                    flex: 1,
                    justifyContent: 'center',
                    borderColor: COLORS.BRAND.Secondary,
                    borderWidth: 0.9 * SIZES.PX,
                },
            }),
        [COLORS]
    )
    return (
        <CustomTouchableOpacity
            onPress={() => {
                router.navigate(ESCREENS.TRANSFER_BALANCE)
            }}
            style={styles.container}
        >
            <Typography type="displaySmall">Перевести средства</Typography>
        </CustomTouchableOpacity>
    )
}
