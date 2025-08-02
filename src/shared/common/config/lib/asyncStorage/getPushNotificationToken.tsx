import AsyncStorage from '@react-native-async-storage/async-storage'
import { getItemFromAsyncStorage } from './getItemFromAsyncStorage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'

export const getPushNotificationToken = async () => {
    const push = await getItemFromAsyncStorage(
        EAsyncStoreKeys.PUSH_NOTIFICATION
    )
    return push
}
