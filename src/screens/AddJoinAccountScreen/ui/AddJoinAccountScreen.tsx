import { useLocalSearchParams } from 'expo-router'
import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { TAddJoinAccountScreenParams } from '../../../shared'
import { AddJoinAccountWidget } from '../../../widgets/AddJoinAccountWidget'

// Заголовок экрана рисует InternalPagesHeader из SCREENS_TITLES —
// своего ScreenTitle здесь не нужно.
export const AddJoinAccountScreen = memo(() => {
    const params = useLocalSearchParams<TAddJoinAccountScreenParams>()
    return (
        <InternalPagesLayout>
            <AddJoinAccountWidget params={params} />
        </InternalPagesLayout>
    )
})
