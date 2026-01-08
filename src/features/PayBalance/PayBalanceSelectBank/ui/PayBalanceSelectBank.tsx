import { memo } from 'react'
import { WebView } from 'react-native-webview'
import { SIZES } from '../../../../shared'
import { Linking, View } from 'react-native'
import { showError } from '../../../../shared/ToastComponent'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'

type Props = {
    link: string
    onSelectBank: () => void
}

export const PayBalanceSelectBank = memo(({ link, onSelectBank }: Props) => {
    if (!link) {
        return (
            <ErrorWhileFetchingForm message="Не удалось сгенерировать ссылку  на оплату" />
        )
    }
    return (
        <View style={{ height: SIZES.HEIGHT(0.7), width: SIZES.WIDTH(0.9) }}>
            <WebView
                onMessage={async (event: any) => {
                    try {
                        await Linking.openURL(event.nativeEvent.data)
                        onSelectBank()
                    } catch (error) {
                        showError({ text: 'Приложение банка не установлено' })
                    }
                }}
                source={{
                    uri: link,
                }}
            />
        </View>
    )
})
