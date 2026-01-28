import { ReactNode, memo } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS, SIZES, ThemeStore } from '../../../shared'

import { Image, StyleSheet, View } from 'react-native'
import { LogoFull } from '../../../shared/Logo'
import { MPLayout } from '../../../shared/MpLayout'
import { OpenUseTerms } from '../../../features/OpenUseTerms'
import BackgroundSvg from '../assets/background.svg'
type Props = {
    children: ReactNode
    hideLogo?: boolean
}

export const LoginRegistrationLayout = memo(({ children, hideLogo }: Props) => {
    const COLORS = ThemeStore.useCOLORS()
    const styles = StyleSheet.create({
        wrapper: {
            width: SIZES.WIDTH(1),
            height: SIZES.HEIGHT(1),
            backgroundColor: COLORS.BACKGROUND.Primary,
            alignItems: 'center',
        },
        black: {
            position: 'absolute',
            width: SIZES.WIDTH(1),
            height: SIZES.HEIGHT(1),
            zIndex: 1,
        },
        bg: {
            objectFit: 'cover',
            width: SIZES.WIDTH(1),
            height: 554 * SIZES.PX,
        },
        logo: {
            zIndex: 2,
            marginBottom: 100,
        },
        childrenWrapper: {
            position: 'absolute',
            bottom: 0,
            zIndex: 2,
            alignItems: 'center',
            width: '100%',
        },
        children: {
            bottom: 0,
            width: '100%',
            borderTopLeftRadius: SIZES.PX * 40,
            borderTopRightRadius: SIZES.PX * 40,
            alignItems: 'center',
            paddingHorizontal: 20 * SIZES.PX,
            paddingVertical: SIZES.PX * 24,
        },
        backgroundImage: {
            position: 'absolute',
            top: 0,
            resizeMode: 'repeat',
        },
    })

    return (
        <KeyboardAwareScrollView
            style={{
                backgroundColor: COLORS.BACKGROUND.Primary,
            }}
            scrollEnabled={false}
            viewIsInsideTabBar // чтобы на андроиде не добавлялся снизу серый блок
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            renderToHardwareTextureAndroid
        >
            <View style={styles.wrapper}>
                {hideLogo ? null : (
                    <BackgroundSvg style={styles.backgroundImage} />
                )}

                <View style={styles.black}></View>

                <View style={styles.childrenWrapper}>
                    {hideLogo ? null : (
                        <View style={styles.logo}>
                            <LogoFull width={250} height={160} />
                        </View>
                    )}
                    <View style={styles.children}>
                        {children}
                        <MPLayout mb={16} mt={16}>
                            <OpenUseTerms />
                        </MPLayout>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
})
