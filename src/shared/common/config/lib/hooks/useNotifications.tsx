import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Linking, Platform } from 'react-native'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { setItemToAsyncStorage } from '../asyncStorage/setItemToAsyncStorage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'
import { router } from 'expo-router'
type Props = {
    setToken: React.Dispatch<React.SetStateAction<string>>
}

export const useNotifications = () => {
    const registerForPushNotificationsAsync = async () => {
        try {
            if (Device.isDevice) {
                const { status: existingStatus } =
                    await Notifications.getPermissionsAsync()
                let finalStatus = existingStatus
                if (existingStatus !== 'granted') {
                    const { status } =
                        await Notifications.requestPermissionsAsync()
                    finalStatus = status
                }
                if (finalStatus !== 'granted') {
                    AsyncStorage.setItem('pushNotificationToken', 'off')
                    return
                }
                const projectId =
                    Constants?.expoConfig?.extra?.eas?.projectId ??
                    Constants?.easConfig?.projectId
                try {
                    const token = (
                        await Notifications.getExpoPushTokenAsync({
                            projectId,
                        })
                    ).data
                    await setItemToAsyncStorage({
                        key: EAsyncStoreKeys.PUSH_NOTIFICATION,
                        value: String(token),
                    })
                } catch (error) {}
            } else {
            }

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                })
            }
        } catch (error) {}
    }

    const handleNotificationResponse = (
        response: Notifications.NotificationResponse
    ) => {
        const data: { url?: string } =
            response.notification.request.content.data
        if (data.url) router.replace(data.url)
    }
    return {
        registerForPushNotificationsAsync,
        handleNotificationResponse,
    }
}
