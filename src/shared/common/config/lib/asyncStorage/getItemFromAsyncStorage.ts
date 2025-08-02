import AsyncStorage from '@react-native-async-storage/async-storage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'
export const getItemFromAsyncStorage = (key: EAsyncStoreKeys) => {
    const res = AsyncStorage.getItem(key)
    return res
}
