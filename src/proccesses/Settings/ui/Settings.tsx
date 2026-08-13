import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ChangeTankVolume } from '../../../features/Settings/ChangeTankVolume'
import { OpenDeleteAccountScreen } from '../../../features/Settings/OpenDeleteAccountScreen'
import { SIZES, SPACING } from '../../../shared'

export const Settings = memo(() => {
    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
    })

    return (
        <View style={styles.container}>
            <ChangeTankVolume />
            <OpenDeleteAccountScreen />
        </View>
    )
})
