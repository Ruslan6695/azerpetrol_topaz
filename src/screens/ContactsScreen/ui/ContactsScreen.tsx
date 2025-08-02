import { memo } from 'react'
import { ContactsWidget } from '../../../widgets/ContactsWidget'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { useLocalSearchParams } from 'expo-router'
import { TContactsScreenParams } from '../../../shared'

type Props = {}

export const ContactsScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TContactsScreenParams>()
    return (
        <InternalPagesLayout hideScroll>
            <ContactsWidget params={params} />
        </InternalPagesLayout>
    )
})
