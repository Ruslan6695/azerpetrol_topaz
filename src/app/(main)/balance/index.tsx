import { memo } from 'react'
import { QrBlock } from '../../../entities/QrBlock'
import { BalanceScreen } from '../../../screens/BalanceScreen'

type Props = {}

const Page = memo((props: Props) => {
    return <BalanceScreen />
})
export default Page
