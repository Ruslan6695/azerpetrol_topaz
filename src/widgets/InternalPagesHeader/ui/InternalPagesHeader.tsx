import * as Device from 'expo-device'
import { usePathname, useRouter } from 'expo-router'
import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { EDeviceOsNames, SCREENS_TITLES, SIZES } from '../../../shared'
import { BackIcon } from '../../../shared/BackIcon'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Typography } from '../../../shared/Typography'
type Props = {}

export const InternalPagesHeader = memo(({}: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            height: Device.osName === EDeviceOsNames.IOS ? 120 : 100 * SIZES.PX,
            paddingTop:
                Device.osName === EDeviceOsNames.IOS ? 30 : 0 * SIZES.PX,
            paddingRight: SIZES.PX * 20,
            alignItems: 'center',
        },
        backButton: {
            padding: 20 * SIZES.PX,
            marginRight: SIZES.PX * 30,
        },
    })
    return (
        <View style={styles.container}>
            <CustomTouchableOpacity
                onPress={() => {
                    router.back()
                }}
                style={styles.backButton}
            >
                <BackIcon />
            </CustomTouchableOpacity>
            <Typography type="displaySmall">
                {SCREENS_TITLES[pathname]}
            </Typography>
        </View>
    )
})
