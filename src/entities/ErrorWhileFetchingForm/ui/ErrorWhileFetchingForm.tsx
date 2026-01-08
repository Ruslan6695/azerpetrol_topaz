import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IMarginsPaddings, SIZES } from '../../../shared'
import { CustomButton } from '../../../shared/CustomButton'
import { ErrorGif } from '../../../shared/ErrorGif'
import { MPLayout } from '../../../shared/MpLayout'
import { Typography } from '../../../shared/Typography'

type Props = {
    message: string
    onReload?: () => void
    margins?: IMarginsPaddings
    buttonProps?: {
        text?: string
        type?: 'primary' | 'secondary' | 'tertiary'
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
            <Typography style={styles.text} textAlign="center">
                {message}
            </Typography>

            {onReload && (
                <CustomButton
                    onPress={onReload}
                    styled={{
                        type: buttonProps?.type
                            ? buttonProps.type
                            : 'secondary',
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
