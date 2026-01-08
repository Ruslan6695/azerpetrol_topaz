import React from 'react'
import { CameraScanner } from '../../../../shared/CameraScanner'
import { CustomButton } from '../../../../shared/CustomButton'
import { StyleSheet, View } from 'react-native'

type Props = {
    onGoBack: () => void
    onScan: (text: string) => void
}

export const ScanCoffeeMachine = ({ onGoBack, onScan }: Props) => {
    return (
        <View style={styles.container}>
            <CameraScanner onScan={onScan} />
            <CustomButton
                onPress={onGoBack}
                styled={{
                    type: 'secondary',
                    width: { type: 'absolute', value: '100%' },
                    marginsPaddings: { mt: 20 },
                }}
            >
                Вернуться назад
            </CustomButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
})
