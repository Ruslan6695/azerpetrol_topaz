import AsyncStorage from '@react-native-async-storage/async-storage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'

export async function removeItemFromAsyncStorage(key: EAsyncStoreKeys) {
    AsyncStorage.removeItem(key)
}
