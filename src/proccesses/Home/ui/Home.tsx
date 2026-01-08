import { memo } from 'react'
import { HomeMainWidget } from '../../../widgets/Home/HomeMainWidget'
import { NewsWidget } from '../../../widgets/News/NewsWidget'
import { MPLayout } from '../../../shared/MpLayout'
import { AppStore } from '../../../shared'

type Props = {}

export const Home = memo((props: Props) => {
    const isTokenRefreshed = AppStore.useIsTokenRefreshed()
    return (
        <>
            <HomeMainWidget />
            {isTokenRefreshed && (
                <MPLayout mb={20} mt={20}>
                    <NewsWidget />
                </MPLayout>
            )}
        </>
    )
})
