import { memo } from 'react'
import { DevelopmentInProgressWidget } from '../../../widgets/DevelopmentInProgressWidget'

type Props = {}

const Page = memo((props: Props) => {
    return <DevelopmentInProgressWidget />
})
export default Page
