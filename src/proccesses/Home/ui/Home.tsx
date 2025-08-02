import { memo } from 'react'
import { HomeMainWidget } from '../../../widgets/Home/HomeMainWidget'
import { NewsWidget } from '../../../widgets/News/NewsWidget'
import { MPLayout } from '../../../shared/MpLayout'

type Props = {}

export const Home = memo((props: Props) => {
    return (
        <>
            <HomeMainWidget />
            <MPLayout mb={20} mt={20}>
                <NewsWidget />
            </MPLayout>
        </>
    )
})
