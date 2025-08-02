import { memo } from 'react'
import { View } from 'react-native'
import { FuelLoadingScreen } from '../../screens/FuelLoadingScreen'

type Props = {}

const Page = memo((props: Props) => {
    return <FuelLoadingScreen/>
})
export default Page
