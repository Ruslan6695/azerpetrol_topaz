import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { PayBalanceWidget } from '../../../widgets/PayBalanceWidget'
import { useLocalSearchParams } from 'expo-router'
import { TPayBalanceScreenParams } from '../../../shared'

type Props = {}

export const PayBalanceScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TPayBalanceScreenParams>()

    return (
        <InternalPagesLayout hideScroll>
            <PayBalanceWidget params={params} />
        </InternalPagesLayout>
    )
})
