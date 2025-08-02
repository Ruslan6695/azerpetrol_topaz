import AsyncStorage from '@react-native-async-storage/async-storage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'

export const setItemToAsyncStorage = async ({
    key,
    value,
}: {
    key: EAsyncStoreKeys
    value: string
}) => {
    await AsyncStorage.setItem(key, value)
}
