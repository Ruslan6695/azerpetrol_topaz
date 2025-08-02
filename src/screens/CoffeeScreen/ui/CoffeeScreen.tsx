import React from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { CustomSelect, useSelect } from '../../../shared/CustomSelect'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { View } from 'react-native'
import { Coffee } from '../../../proccesses/Coffee'
import { useLocalSearchParams } from 'expo-router'
import { TCoffeeScreenParams } from '../../../shared'

type Props = {}

export const CoffeeScreen = (props: Props) => {
    const params = useLocalSearchParams<TCoffeeScreenParams>()

    return <Coffee params={params} />
}
