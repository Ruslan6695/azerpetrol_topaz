import {
    Redirect,
    router,
    useFocusEffect,
    useRootNavigation,
    useRootNavigationState,
} from 'expo-router'
import React, { useCallback } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { ESCREENS } from '../shared'

type Props = {}

const Page = (props: Props) => {
    const navigation = useRootNavigation()
    const state = useRootNavigationState()
    const [ready, setReady] = React.useState(false)

    useFocusEffect(
        useCallback(() => {
            router.dismiss()
        }, [])
    )

    return <></>
}

export default Page
