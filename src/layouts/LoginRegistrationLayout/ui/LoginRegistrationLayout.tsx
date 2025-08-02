import { ReactNode, memo } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS, SIZES } from '../../../shared'

import { StyleSheet, View } from 'react-native'
import BgSvg from '../assets/background.svg'
type Props = {
    children: ReactNode
}

export const LoginRegistrationLayout = memo(({ children }: Props) => {
    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: COLORS.WHITE }}
            contentContainerStyle={{
                height: SIZES.HEIGHT(1),
            }}
            viewIsInsideTabBar // чтобы на андроиде не добавлялся снизу серый блок
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            renderToHardwareTextureAndroid
        >
            <View style={styles.wrapper}>
                <BgSvg style={styles.bg} />
                {children}
            </View>
        </KeyboardAwareScrollView>
    )
})
const styles = StyleSheet.create({
    wrapper: {
        width: SIZES.WIDTH(1),
        height: SIZES.HEIGHT(1),
        backgroundColor: COLORS.GREEN,
    },
    bg: {
        position: 'absolute',
        top: -100 * SIZES.PX,
        left: -70 * SIZES.PX,
        transform: [{ rotate: '-25deg' }],
        opacity: 0.5,
    },
})
