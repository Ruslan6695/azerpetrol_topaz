import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { SIZES, SPACING, TAuthStep } from '../../../shared'
import { Wordmark } from '../../../shared/Logo'
import { Typography } from '../../../shared/Typography'
import { RegistrationWidget } from '../../../widgets/RegistrationWidget'

type Props = {}

// 200px по ширине макета: 200 / 5.8617 ≈ 34.
const WORDMARK_HEIGHT = 34

export const RegistrationScreen = memo((props: Props) => {
    const [step, setStep] = useState<TAuthStep>('form')

    const handleStepChange = useCallback((next: TAuthStep) => {
        setStep(next)
    }, [])

    const styles = StyleSheet.create({
        header: {
            alignItems: 'center',
            gap: SPACING.LG * SIZES.PX,
        },
        slogan: {
            maxWidth: 280 * SIZES.PX,
        },
    })

    const header =
        step === 'captcha' ? null : (
            <View style={styles.header}>
                <Wordmark height={WORDMARK_HEIGHT} />
                <View style={styles.slogan}>
                    <Typography
                        type="body14"
                        color="secondary"
                        textAlign="center"
                    >
                        Топливо, кофе и бонусы — в одном приложении
                    </Typography>
                </View>
            </View>
        )

    return (
        <LoginRegistrationLayout
            header={header}
            headerTop={130}
            disableSheetPaddings={step === 'captcha'}
        >
            <RegistrationWidget onStepChange={handleStepChange} />
        </LoginRegistrationLayout>
    )
})
