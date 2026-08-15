import { useLocalSearchParams } from 'expo-router'
import { memo } from 'react'
import { Coffee } from '../../../proccesses/Coffee'
import { TCoffeeScreenParams } from '../../../shared'

export const CoffeeScreen = memo(() => {
    const params = useLocalSearchParams<TCoffeeScreenParams>()

    return <Coffee params={params} />
})
