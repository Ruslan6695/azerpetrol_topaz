import { requestForegroundPermissionsAsync } from 'expo-location'
import { PermissionResponse } from 'expo-contacts'
import { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'

export function useGetLocationPermission() {
    const [locationPermission, setLocationPermission] =
        useState<PermissionResponse | null>(null)

    const fetchLocation = useCallback(async () => {
        let response = await requestForegroundPermissionsAsync()
        setLocationPermission(response)
    }, [])

    const fetchLocationOnPress = useCallback(async () => {
        let response = await requestForegroundPermissionsAsync()
        setLocationPermission(response)
        if (!response.canAskAgain) {
            Linking.openSettings()
        }
    }, [])

    useEffect(() => {
        fetchLocation()
    }, [])
    return {
        locationPermission,
        setLocationPermission,
        fetchLocationOnPress,
    }
}
