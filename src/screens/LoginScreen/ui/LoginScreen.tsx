import React from 'react'
import { LoginRegistrationLayout } from '../../../layouts/LoginRegistrationLayout'
import { LoginWidget } from '../../../widgets/LoginWidget'
import { UserStore } from '../../../shared'
import { Redirect } from 'expo-router'

type Props = {}

export const LoginScreen = (props: Props) => {
    return (
        <LoginRegistrationLayout>
            <LoginWidget />
        </LoginRegistrationLayout>
    )
}
