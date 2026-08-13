import NetInfo from '@react-native-community/netinfo'
import * as Notifications from 'expo-notifications'
import { Href, Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import * as TaskManager from 'expo-task-manager'
import React, { useEffect } from 'react'
import {
    AppStore,
    ESCREENS,
    FuelStore,
    SCREENS_TITLES,
    ThemeStore,
    UserStore,
    useNotifications,
    useSetFonts,
} from '../shared'
import { ToastComponent } from '../shared/ToastComponent'

import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ConfirmAddJoinAccountModal } from '../features/AddJoinAccount/ConfirmAddJoinAccountModal'

const TASK = 'BACKGROUND_NOTIFICATION-TASK'
TaskManager.defineTask(TASK)
SplashScreen.preventAutoHideAsync()

export default function Layout() {
    const COLORS = ThemeStore.useCOLORS()
    Notifications.registerTaskAsync(TASK)
    const { registerForPushNotificationsAsync, handleNotificationResponse } =
        useNotifications()
    const isHasNet = AppStore.useIsHasNet()
    const toggleIsHasNet = AppStore.useToggleIsHasNet()
    const router = useRouter()
    const getUser = UserStore.useGetUser()
    const user = UserStore.useUser()
    const isGetUserLoading = UserStore.useGetUserIsLoadung()
    const fontIsLoaded = useSetFonts()
    const getColorTheme = ThemeStore.useGetColoreTheme()
    const getTankVolume = FuelStore.useGetTankVolume()
    /*   useEffect(() => {
        let isMounted = true

        function redirect(notification: Notifications.Notification) {
            const url = notification.request.content.data?.url
            if (url) {
                router.push(url)
            }
        }

        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (!isMounted || !response?.notification) {
                return
            }
            redirect(response?.notification)
        })

        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    redirect(response.notification)
                }
            )

        return () => {
            isMounted = false
            subscription.remove()
        }
    }, []) */
    useEffect(() => {
        getColorTheme()
        getTankVolume()
        let isMounted = true
        let subscription: any
        if (isHasNet) {
            registerForPushNotificationsAsync()

            function redirect(notification: Notifications.Notification) {
                // Маршрут приходит в payload пуша, то есть с бэкенда:
                // typedRoutes его проверить не может, отсюда явный тип.
                const url = notification.request.content.data?.url
                if (typeof url === 'string') {
                    router.navigate(url as Href)
                }
            }

            /*   Notifications.getLastNotificationResponseAsync().then(
                (response) => {
                    if (!isMounted || !response?.notification) {
                        return
                    }
                    redirect(response?.notification)
                }
            ) */

            subscription =
                Notifications.addNotificationResponseReceivedListener(
                    (response) => {
                        redirect(response.notification)
                    }
                )

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: false,
                }),
            })
        }

        return () => {
            isMounted = false
            subscription?.remove()
        }
    }, [isHasNet])

    useEffect(() => {
        if (!isGetUserLoading && fontIsLoaded) {
            if (!user) {
                router.replace(ESCREENS.LOGIN)
            } else {
                router.replace(ESCREENS.HOME)
            }
            SplashScreen.hideAsync()
        }
    }, [user, isGetUserLoading, fontIsLoaded])

    useEffect(() => {
        getUser()
        NetInfo.addEventListener((networkState) => {
            networkState.isConnected
                ? toggleIsHasNet(true)
                : toggleIsHasNet(false)
        })
    }, [])

    return (
        <GestureHandlerRootView>
            {!user ? (
                <Stack screenOptions={{ animation: 'none' }}>
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name="index"
                    />

                    <Stack.Screen
                        options={{ headerShown: false }}
                        name={'login/index'}
                    />
                    <Stack.Screen
                        options={{ headerShown: false }}
                        name={'registration/index'}
                    />
                </Stack>
            ) : (
                <>
                    <Stack>
                        <Stack.Screen
                            options={{ headerShown: false }}
                            name="index"
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'(main)'}
                        />
                        <Stack.Screen
                            options={{
                                title: 'Цены на топливо',

                                headerShown: false,
                            }}
                            name={'fuel_prices/index'}
                        />
                        <Stack.Screen
                            options={{
                                title: 'Пополнить баланс',
                                headerShown: false,
                            }}
                            name={'pay_balance/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'transferBalance/index'}
                        />
                        <Stack.Screen
                            options={{
                                title: 'Пополнить баланс',

                                headerShown: false,
                            }}
                            name={'success/index'}
                        />
                        <Stack.Screen
                            options={{
                                title: 'Контакты',

                                headerShown: false,
                            }}
                            name={'contacts/index'}
                        />
                        <Stack.Screen
                            options={{
                                title: SCREENS_TITLES[ESCREENS.HELP],

                                headerShown: false,
                            }}
                            name={'help/index'}
                        />
                        <Stack.Screen
                            options={{
                                title: SCREENS_TITLES[ESCREENS.HISTORY],

                                headerShown: false,
                            }}
                            name={'history/index'}
                        />
                        <Stack.Screen
                            options={{
                                title: SCREENS_TITLES[ESCREENS.HISTORY],

                                headerShown: false,
                            }}
                            name={'history_details/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'fuelLoading/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'coffee_bonus/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'bonuses/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'bonuses/details/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'add_join_account/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'about_app/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'about_company/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'settings/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'delete_account/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'news/index'}
                        />
                        <Stack.Screen
                            options={{
                                headerShown: false,
                            }}
                            name={'news/details/index'}
                        />
                    </Stack>
                </>
            )}

            <ToastComponent />
            <StatusBar hidden />
            <ConfirmAddJoinAccountModal />
        </GestureHandlerRootView>
    )
}
