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
import { GivePermissionModal } from '../../../features/GivePermissionModal'
import { CustomText } from '../../../shared/CustomText'

type Props = {
    params: Partial<TContactsScreenParams>
}

export const ContactsWidget = memo(({ params }: Props) => {
    const {
        contactsPermission,
        fetchContactsPermissionOnPress,
        fetchContactsPermission,
        isShowPermissionModal,
        handleAbortAsyncStPermission,
        handleSubmitAsyncStPermission,
        contactsPermissionAsyncSt,
    } = useGetContactsPermission()

    useEffect(() => {
        if (contactsPermission)
            //@ts-ignore
            checkIsContactInSystem(contactsPermission?.status)
    }, [contactsPermission])
    return (
        <>
            <ScreenTitle title="Выберите пользователя" />
            <CustomText>{contactsPermissionAsyncSt}</CustomText>
            {contactsPermission?.status == PermissionStatus.DENIED ||
            !contactsPermissionAsyncSt ? (
                <>
                    <GetContactsPermission
                        fetchPermission={fetchContactsPermission}
                        onAllowPermission={fetchContactsPermissionOnPress}
                    />
                </>
            ) : (
                <MapContacts onSelectLink={params.onSelectLink} />
            )}
            <GivePermissionModal
                onSubmit={handleSubmitAsyncStPermission}
                handleClose={handleAbortAsyncStPermission}
                description={`Приложение Азерпетрол запрашивает разрешение на использование и передачу контактов на наш сервер для определения зарегистрированных в приложении пользователей.\nВаши контакты используются только во время работы приложения и не хранятся на нашем сервере.`}
                isModalOpened={isShowPermissionModal}
                title="Разрешение на использование контактов"
            />
        </>
    )
})
