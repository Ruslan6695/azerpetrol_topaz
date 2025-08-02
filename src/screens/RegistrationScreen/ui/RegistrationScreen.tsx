import React from 'react'
import { RegistrationWidget } from '../../../widgets/RegistrationWidget'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { CustomText } from '../../../shared/CustomText'

type Props = {}

export const RegistrationScreen = (props: Props) => {
    return (
        <LoginRegistrationLayout>
            <RegistrationWidget />
        </LoginRegistrationLayout>
    )
}
