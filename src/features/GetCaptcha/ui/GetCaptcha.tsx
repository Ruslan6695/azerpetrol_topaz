import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import WebView from 'react-native-webview'
import { MOBILE_CAPTCHA_URL, SIZES, ThemeStore } from '../../../shared'

type Props = {
    onSubmitCaptcha: ({
        confType,
        captchaToken,
    }: {
        confType?: 'sms' | 'call'
        captchaToken?: string
    }) => void
}

// Виджет Yandex SmartCaptcha рисует собственную разметку и к токенам макета
// не приводится — в макете экрана капчи нет вовсе. Задаём ему только фон
// по теме, иначе в тёмной теме получаем белую вспышку на пол-экрана.
export const GetCaptcha = memo(({ onSubmitCaptcha }: Props) => {
    const COLORS = ThemeStore.useCOLORS()

    const styles = StyleSheet.create({
        container: {
            height: SIZES.HEIGHT(0.62),
            width: SIZES.WIDTH(1),
            backgroundColor: COLORS.BACKGROUND.Primary,
        },
        webView: {
            backgroundColor: COLORS.BACKGROUND.Primary,
        },
    })

    return (
        <View style={styles.container}>
            <WebView
                style={styles.webView}
                onMessage={async (event: any) => {
                    if (event.nativeEvent.data) {
                        onSubmitCaptcha({
                            captchaToken: event.nativeEvent.data,
                        })
                    }
                }}
                focusable={false}
                showsVerticalScrollIndicator={false}
                source={{
                    uri: MOBILE_CAPTCHA_URL,
                }}
            />
        </View>
    )
})
