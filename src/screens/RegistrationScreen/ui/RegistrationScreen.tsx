import React from 'react'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { RegistrationWidget } from '../../../widgets/RegistrationWidget'

type Props = {}

export const RegistrationScreen = (props: Props) => {
    return (
        <LoginRegistrationLayout>
            <RegistrationWidget />
        </LoginRegistrationLayout>
    )
}
