import { PermissionStatus } from 'expo-contacts'
import { memo, useEffect } from 'react'
import { GetContactsPermission } from '../../../features/Contacts/GetContactsPermission'
import {
    MapContacts,
    checkIsContactInSystem,
} from '../../../features/Contacts/MapContacts'
import {
    TContactsScreenParams,
    useGetContactsPermission,
} from '../../../shared'

type Props = {
    params: Partial<TContactsScreenParams>
}

export const ContactsWidget = memo(({ params }: Props) => {
    const {
        contactsPermission,
        fetchContactsPermissionOnPress,
        fetchContactsPermission,
    } = useGetContactsPermission()

    useEffect(() => {
        if (contactsPermission)
            checkIsContactInSystem(contactsPermission.status)
    }, [contactsPermission])
    // Заголовок «Контакты» приходит из шапки InternalPagesHeader
    return contactsPermission?.status == PermissionStatus.DENIED ? (
        <GetContactsPermission
            fetchPermission={fetchContactsPermission}
            onAllowPermission={fetchContactsPermissionOnPress}
        />
    ) : (
        <MapContacts onSelectLink={params.onSelectLink} />
    )
})
