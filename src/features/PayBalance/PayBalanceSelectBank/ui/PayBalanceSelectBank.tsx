import { memo, useCallback } from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import { PRESS_SCALE, SIZES, SPACING, ThemeStore } from '../../../../shared'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { CenteredState } from '../../../../shared/CenteredState'
import { Glass } from '../../../../shared/GlassCard'
import { Loader } from '../../../../shared/Loader'
import { PressableScale } from '../../../../shared/PressableScale'
import { showError } from '../../../../shared/ToastComponent'
import { Typography } from '../../../../shared/Typography'

type Props = {
    link: string
    isOpened: boolean
    onSelectBank: () => void
    onClose: () => void
}

const CLOSE_SIZE = 38
const SHEET_HEIGHT_PART = 0.9

export const PayBalanceSelectBank = memo(
    ({ link, isOpened, onSelectBank, onClose }: Props) => {
        const COLORS = ThemeStore.useCOLORS()

        // Страница СБП отдаёт диплинк выбранного банка через postMessage.
        const handleMessage = useCallback(
            async (event: WebViewMessageEvent) => {
                try {
                    await Linking.openURL(event.nativeEvent.data)
                    onSelectBank()
                } catch (error) {
                    showError({ text: 'Приложение банка не установлено' })
                }
            },
            [onSelectBank]
        )

        const styles = StyleSheet.create({
            container: {
                height: SIZES.HEIGHT(SHEET_HEIGHT_PART),
                paddingTop: SPACING.XL * SIZES.PX,
                paddingBottom: SPACING.XL * SIZES.PX,
            },
            header: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: SPACING.SCREEN * SIZES.PX,
            },
            close: {
                width: CLOSE_SIZE * SIZES.PX,
                height: CLOSE_SIZE * SIZES.PX,
                alignItems: 'center',
                justifyContent: 'center',
            },
            webView: {
                flex: 1,
                marginTop: SPACING.MD * SIZES.PX,
                backgroundColor: 'transparent',
            },
            loader: {
                ...StyleSheet.absoluteFillObject,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.GLASS.Surface,
            },
        })

        const renderLoading = () => (
            <View style={styles.loader}>
                <Loader />
            </View>
        )

        return (
            <BottomSheet
                isOpened={isOpened}
                handleClose={onClose}
                closeOnPressOutside
                bgDark
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Typography type="num18">Выберите банк</Typography>

                        <PressableScale
                            onPress={onClose}
                            scaleTo={PRESS_SCALE.BACK}
                        >
                            <Glass
                                level="secondary"
                                radius={(CLOSE_SIZE / 2) * SIZES.PX}
                            >
                                <View style={styles.close}>
                                    <Typography
                                        type="num16"
                                        customColor={COLORS.TEXT.Primary}
                                    >
                                        ✕
                                    </Typography>
                                </View>
                            </Glass>
                        </PressableScale>
                    </View>

                    {link ? (
                        <WebView
                            style={styles.webView}
                            onMessage={handleMessage}
                            startInLoadingState
                            renderLoading={renderLoading}
                            source={{ uri: link }}
                        />
                    ) : (
                        <CenteredState
                            variant="error"
                            title="Не удалось создать платёж"
                            description="Не получилось сгенерировать ссылку на оплату. Попробуйте ещё раз или обратитесь в поддержку."
                            action={{ label: 'Закрыть', onPress: onClose }}
                        />
                    )}
                </View>
            </BottomSheet>
        )
    }
)
