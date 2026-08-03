import { usePathname, useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    PRESS_SCALE,
    RADII,
    SCREENS_TITLES,
    SIZES,
    ThemeStore,
} from '../../../shared'
import { Glass } from '../../../shared/GlassCard'
import { PressableScale } from '../../../shared/PressableScale'
import { Typography } from '../../../shared/Typography'

type Props = {}

const BACK_SIZE = 38

export const InternalPagesHeader = memo(({}: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const COLORS = ThemeStore.useCOLORS()
    // Экраны вне группы (main) не обёрнуты в SafeAreaView, а статус-бар
    // скрыт глобально — без этого отступа шапка уезжает под вырез.
    const insets = useSafeAreaInsets()

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12 * SIZES.PX,
            paddingTop: insets.top + 10 * SIZES.PX,
            paddingBottom: 12 * SIZES.PX,
            paddingHorizontal: 20 * SIZES.PX,
        },
        back: {
            width: BACK_SIZE * SIZES.PX,
            height: BACK_SIZE * SIZES.PX,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

    return (
        <View style={styles.container}>
            <PressableScale onPress={handleBack} scaleTo={PRESS_SCALE.BACK}>
                <Glass level="secondary" radius={(BACK_SIZE / 2) * SIZES.PX}>
                    <View style={styles.back}>
                        <Typography
                            type="num16"
                            customColor={COLORS.TEXT.Primary}
                        >
                            ←
                        </Typography>
                    </View>
                </Glass>
            </PressableScale>

            <Typography type="num18">{SCREENS_TITLES[pathname]}</Typography>
        </View>
    )
})
