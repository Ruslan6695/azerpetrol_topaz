import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { SIZES } from '../../../shared'

type Props = {
    askPermission: () => void
}

export const CameraScannerHasNotPermissions = memo(
    ({ askPermission }: Props) => {
        return (
            <View style={styles.container}>
                <ErrorWhileFetchingForm
                    buttonProps={{ type: 'primary', text: 'Разрешить' }}
                    onReload={askPermission}
                    message="Для сканирования штрих-кодов нужно разрешение на
                        использование камеры."
                />
            </View>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        maxWidth: SIZES.WIDTH(0.85),
    },
})
