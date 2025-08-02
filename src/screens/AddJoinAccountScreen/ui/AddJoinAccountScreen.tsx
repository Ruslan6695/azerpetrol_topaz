import { memo } from 'react'
import { AddJoinAccountWidget } from '../../../widgets/AddJoinAccountWidget'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { useLocalSearchParams } from 'expo-router'
import { TAddJoinAccountScreenParams } from '../../../shared'

type Props = {}

export const AddJoinAccountScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TAddJoinAccountScreenParams>()
    return (
        <InternalPagesLayout>
            <ScreenTitle title="Привязать пользователя" />
            <AddJoinAccountWidget params={params}  />
        </InternalPagesLayout>
    )
})
