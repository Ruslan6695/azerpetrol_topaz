import * as Contacts from 'expo-contacts'
import { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'

export function useGetContactsPermission() {
    const [contactsPermission, setContactsPermission] =
        useState<Contacts.PermissionResponse | null>(null)

    const fetchContactsPermission = useCallback(async () => {
        const permission = await Contacts.requestPermissionsAsync()
        setContactsPermission(permission)
    }, [])

    const fetchContactsPermissionOnPress = useCallback(async () => {
        const permission = await Contacts.requestPermissionsAsync()
        setContactsPermission(permission)
        if (!permission.canAskAgain) {
            Linking.openSettings()
        }
    }, [])

    useEffect(() => {
        ;(async () => {
            const permission = await Contacts.requestPermissionsAsync()

            setContactsPermission(permission)
        })()
    }, [])

    return {
        contactsPermission,
        setContactsPermission,
        fetchContactsPermissionOnPress,
        fetchContactsPermission,
    }
}
