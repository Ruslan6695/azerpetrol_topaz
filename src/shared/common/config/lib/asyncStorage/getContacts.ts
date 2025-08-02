import AsyncStorage from '@react-native-async-storage/async-storage'
import { getItemFromAsyncStorage } from './getItemFromAsyncStorage'
import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'

export const getContacts = async () => {
    const contacts = JSON.parse(
        String(await getItemFromAsyncStorage(EAsyncStoreKeys.CONTACTS))
    )
    return contacts
}
