import * as Contacts from 'expo-contacts'
import { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import { getItemFromAsyncStorage } from '../asyncStorage/getItemFromAsyncStorage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'
import { useModal } from './useModal'
import { setItemToAsyncStorage } from '../asyncStorage/setItemToAsyncStorage'

export function useGetContactsPermission() {
    const [contactsPermission, setContactsPermission] =
        useState<Contacts.PermissionResponse | null>(null)
    const [contactsPermissionAsyncSt, setContactsPermissionAsyncSt] = useState<
        boolean | null
    >(null)

    const {
        handleCloseModal: handleCloseShowPermissionModal,
        handleOpenModal: handleOpenShowPermissionModal,
        isShowModal: isShowPermissionModal,
    } = useModal()

    const fetchContactsPermission = useCallback(async () => {
        const permission = await Contacts.requestPermissionsAsync()
        setContactsPermission(permission)
    }, [])

    const fetchContactsPermissOnAsync = useCallback(async () => {
        const permission = await getItemFromAsyncStorage(
            EAsyncStoreKeys.CONTACTS_PERMISSION
        )
        switch (permission) {
            case '0':
                setContactsPermissionAsyncSt(false)
                break

            case '1':
                setContactsPermissionAsyncSt(true)
                break

            default:
                handleOpenShowPermissionModal()
                break
        }
    }, [])

    const handleSubmitAsyncStPermission = useCallback(() => {
        setItemToAsyncStorage({
            key: EAsyncStoreKeys.CONTACTS_PERMISSION,
            value: '1',
        })
        handleCloseShowPermissionModal()
        setContactsPermissionAsyncSt(true)
    }, [])

    const handleAbortAsyncStPermission = useCallback(() => {
        setItemToAsyncStorage({
            key: EAsyncStoreKeys.CONTACTS_PERMISSION,
            value: '0',
        })
        handleCloseShowPermissionModal()
        setContactsPermissionAsyncSt(false)
    }, [])

    const fetchContactsPermissionOnPress = useCallback(async () => {
        if (contactsPermissionAsyncSt) {
            const permission = await Contacts.requestPermissionsAsync()
            setContactsPermission(permission)
            if (!permission.canAskAgain) {
                Linking.openSettings()
            }
        } else {
            handleOpenShowPermissionModal()
        }
    }, [contactsPermissionAsyncSt])

    useEffect(() => {
        if (contactsPermissionAsyncSt === null) {
            fetchContactsPermissOnAsync()
        }
        ;(async () => {
            if (contactsPermissionAsyncSt) {
                const permission = await Contacts.requestPermissionsAsync()
                setContactsPermission(permission)
            }
        })()
    }, [contactsPermissionAsyncSt])

    return {
        contactsPermission,
        setContactsPermission,
        fetchContactsPermissionOnPress,
        fetchContactsPermission,
        contactsPermissionAsyncSt,
        isShowPermissionModal,
        handleSubmitAsyncStPermission,
        handleAbortAsyncStPermission,
    }
}
