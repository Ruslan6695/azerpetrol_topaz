import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { CustomText } from '../../../shared/CustomText'
import { EDeviceOsNames, SCREENS_TITLES, SIZES } from '../../../shared'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { BackIcon } from '../../../shared/BackIcon'
import { useNavigation, useRouter, usePathname } from 'expo-router'
import * as Device from 'expo-device'
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
            <CustomText fz={18}>{SCREENS_TITLES[pathname]}</CustomText>
        </View>
    )
})
