import { ReactNode, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RADII, SIZES, SPACING, ThemeStore } from '../../../shared'
import { AmbientBackground } from '../../../shared/AmbientBackground'
import { Glass } from '../../../shared/GlassCard'

type Props = {
    children: ReactNode
    /** Шапка над шитом: вордмарк, слоган, заголовок. Задаёт экран, не лэйаут */
    header?: ReactNode
    /** Отступ шапки сверху в единицах макета: 150 — вход, 130 — регистрация */
    headerTop?: number
    /** Снять внутренние отступы шита — для содержимого во всю ширину (капча) */
    disableSheetPaddings?: boolean
}

// Обвязка экранов входа и регистрации: амбиентный фон + шит, прижатый к низу.
// Про логотип, слоган и «Условия использования» лэйаут не знает — верх у входа
// и регистрации разный, поэтому шапку целиком передаёт экран.
export const LoginRegistrationLayout = memo(
    ({ children, header, headerTop = 150, disableSheetPaddings }: Props) => {
        const COLORS = ThemeStore.useCOLORS()
        const insets = useSafeAreaInsets()

        const styles = StyleSheet.create({
            wrapper: {
                flex: 1,
                minHeight: SIZES.HEIGHT(1),
                justifyContent: 'flex-end',
                backgroundColor: COLORS.BACKGROUND.Primary,
            },
            header: {
                position: 'absolute',
                top: headerTop * SIZES.PX,
                left: 0,
                right: 0,
                alignItems: 'center',
            },
            sheet: {
                // Шит скруглён только сверху: style мержится после стилей Glass
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderBottomWidth: 0,
            },
            sheetContent: {
                gap: SPACING.MD * SIZES.PX,
                paddingTop: disableSheetPaddings ? 0 : 26 * SIZES.PX,
                paddingHorizontal: disableSheetPaddings
                    ? 0
                    : SPACING.SCREEN * SIZES.PX,
                // 34 из макета играет роль хоум-индикатора — макет рисован без safe area
                paddingBottom: Math.max(34 * SIZES.PX, insets.bottom),
            },
        })

        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: COLORS.BACKGROUND.Primary }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={false}
                viewIsInsideTabBar // чтобы на андроиде не добавлялся снизу серый блок
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                renderToHardwareTextureAndroid
            >
                <View style={styles.wrapper}>
                    <AmbientBackground />

                    {header && <View style={styles.header}>{header}</View>}

                    <Glass
                        level="secondary"
                        radius={RADII.SHEET * SIZES.PX}
                        style={styles.sheet}
                    >
                        <View style={styles.sheetContent}>{children}</View>
                    </Glass>
                </View>
            </KeyboardAwareScrollView>
        )
    }
)
