import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorGif } from '../../../shared/ErrorGif'
import { CustomButton, ECustomButtonTypes } from '../../../shared/CustomButton'
import { CustomText } from '../../../shared/CustomText'
import { MPLayout } from '../../../shared/MpLayout'
import { IMarginsPaddings, SIZES } from '../../../shared'

type Props = {
    message: string
    onReload?: () => void
    margins?: IMarginsPaddings
    buttonProps?: {
        text?: string
        type?: ECustomButtonTypes
        width?: { type: 'px' | 'absolute'; value: string | number }
    }
}

export const ErrorWhileFetchingForm = ({
    message,
    onReload,
    margins,
    buttonProps,
}: Props) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: margins?.mt ? margins?.mt * SIZES.PX : 0,
            marginBottom: margins?.mb ? margins?.mb * SIZES.PX : 0,
            marginRight: margins?.mr ? margins?.mr * SIZES.PX : 0,
            marginLeft: margins?.ml ? margins?.ml * SIZES.PX : 0,
        },
        text: {
            maxWidth: SIZES.WIDTH(0.95),
        },
    })

    return (
        <View style={styles.container}>
            <MPLayout mb={-30}>
                <ErrorGif />
            </MPLayout>
            <CustomText fz={17} style={styles.text} textAlign="center">
                {message}
            </CustomText>

            {onReload && (
                <CustomButton
                    onPress={onReload}
                    styled={{
                        type: buttonProps?.type ? buttonProps.type : 'ERROR',
                        width: buttonProps?.width || { type: 'px', value: 200 },
                        marginsPaddings: { mt: 20 },
                    }}
                >
                    {buttonProps?.text ? buttonProps.text : 'Попробовать снова'}
                </CustomButton>
            )}
        </View>
    )
}
