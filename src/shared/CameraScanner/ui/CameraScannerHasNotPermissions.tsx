import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { CustomText } from '../../../shared/CustomText'
import { SIZES } from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { MPLayout } from '../../../shared/MpLayout'
import { ErrorGif } from '../../ErrorGif'

type Props = {
    askPermission: () => void
}

export const CameraScannerHasNotPermissions = memo(
    ({ askPermission }: Props) => {
        return (
            <View style={styles.container}>
                <ErrorGif />
                <MPLayout mb={20}>
                    <CustomText textAlign="center" fz={18}>
                        Для сканирования QR-кодов нужно разрешение на
                        использование камеры.
                    </CustomText>
                </MPLayout>

                <CustomButton onPress={askPermission}>РАЗРЕШИТЬ</CustomButton>
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
