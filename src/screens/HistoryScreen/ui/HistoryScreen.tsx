import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { HistoryStore, HistoryWidget } from '../../../widgets/HistoryWidget'

export const HistoryScreen = memo(() => {
    const requestLoadMore = HistoryStore.useRequestLoadMore()

    return (
        <InternalPagesLayout onScrollToEnd={requestLoadMore}>
            <HistoryWidget />
        </InternalPagesLayout>
    )
})
