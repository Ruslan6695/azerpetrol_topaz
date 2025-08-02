import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { TransferBalanceWidget } from '../../../widgets/TransferBalanceWidget'
import { useLocalSearchParams } from 'expo-router'
import { TTRansferScreenParams } from '../../../shared'

type Props = {}

export const TransferBalanceScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TTRansferScreenParams>()
    

    return (
        <InternalPagesLayout>
            <TransferBalanceWidget params={params} />
        </InternalPagesLayout>
    )
})
