import { memo } from 'react'
import { HistoryDetailsWidget } from '../../../widgets/HistoryDetailsWidget'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import type { THistoryDetailsScreenParams } from '../../../entities/History'
import { useLocalSearchParams } from 'expo-router'

type Props = {}

export const HistoryDetailsScreen = memo((props: Props) => {
    //@ts-ignore
    const params = useLocalSearchParams<THistoryDetailsScreenParams>()
    return (
        <InternalPagesLayout>
            <HistoryDetailsWidget params={params} />
        </InternalPagesLayout>
    )
})
