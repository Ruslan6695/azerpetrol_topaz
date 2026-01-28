import React from 'react'
import { StyleSheet, View } from 'react-native'
import WebView from 'react-native-webview'
import { COLORS_DARK, SIZES } from '../../../shared'

type Props = {
    onSubmitCaptcha: ({
        confType,
        captchaToken,
    }: {
        confType?: 'sms' | 'call'
        captchaToken?: string
    }) => void
}

export const GetCaptcha = ({ onSubmitCaptcha }: Props) => {
    return (
        <View style={styles.container}>
            <WebView
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
                    uri: `https://azscontrol.ru/mobile_captcha/`,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: SIZES.HEIGHT(0.8),
        width: SIZES.WIDTH(1),
    },
})
