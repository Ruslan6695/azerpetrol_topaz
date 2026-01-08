import { PermissionStatus } from 'expo-contacts'
import { memo, useEffect } from 'react'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { GetContactsPermission } from '../../../features/Contacts/GetContactsPermission'
import { MapContacts } from '../../../features/Contacts/MapContacts'
import { checkIsContactInSystem } from '../../../features/Contacts/MapContacts/lib/helpers/checkIsContactsInSystem'
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
            //@ts-ignore
            checkIsContactInSystem(contactsPermission?.status)
    }, [contactsPermission])
    return (
        <>
            <ScreenTitle title="Выберите" />
            {contactsPermission?.status == PermissionStatus.DENIED ? (
                <>
                    <GetContactsPermission
                        fetchPermission={fetchContactsPermission}
                        onAllowPermission={fetchContactsPermissionOnPress}
                    />
                </>
            ) : (
                <MapContacts onSelectLink={params.onSelectLink} />
            )}
        </>
    )
})
