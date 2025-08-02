import { memo } from 'react'
import { SuccessWidget } from '../../../widgets/SuccessWidget'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { TSuccessScreenParams } from '../../../shared'
import { useLocalSearchParams } from 'expo-router'

type Props = {}

export const SuccessScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TSuccessScreenParams>()

    return (
        <InternalPagesLayout>
            <SuccessWidget params={params} />
        </InternalPagesLayout>
    )
})
