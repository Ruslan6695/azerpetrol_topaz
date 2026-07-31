import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { OpenUseTerms } from '../../../features/OpenUseTerms'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { SIZES, SPACING, TAuthStep } from '../../../shared'
import { Wordmark } from '../../../shared/Logo'
import { Typography } from '../../../shared/Typography'
import { LoginWidget } from '../../../widgets/LoginWidget'

type Props = {}

// Вордмарк макета — 240px по ширине, у Wordmark пропом идёт только height
// (соотношение 849.942 / 145 зашито внутри): 240 / 5.8617 ≈ 41.
const WORDMARK_HEIGHT = 41

export const LoginScreen = memo((props: Props) => {
    const [step, setStep] = useState<TAuthStep>('form')

    const handleStepChange = useCallback((next: TAuthStep) => {
        setStep(next)
    }, [])

    const styles = StyleSheet.create({
        header: {
            alignItems: 'center',
            gap: 18 * SIZES.PX,
        },
        slogan: {
            maxWidth: 280 * SIZES.PX,
        },
        terms: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: SPACING.XS * SIZES.PX,
        },
    })

    // На капче виджет занимает почти весь экран — шапка не помещается
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
            headerTop={150}
            disableSheetPaddings={step === 'captcha'}
        >
            <LoginWidget onStepChange={handleStepChange} />

            {/* В макете подпись есть только в шите логина, на остальных шагах её нет */}
            {step === 'form' && (
                <View style={styles.terms}>
                    <OpenUseTerms />
                </View>
            )}
        </LoginRegistrationLayout>
    )
})
