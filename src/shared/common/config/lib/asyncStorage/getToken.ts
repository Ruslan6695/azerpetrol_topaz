import { EAsyncStoreKeys } from '../../enums/EAsyncStoreKeys'
import { getItemFromAsyncStorage } from './getItemFromAsyncStorage'

export async function getToken() {
    const token = await getItemFromAsyncStorage(EAsyncStoreKeys.TOKEN)
    return token
}
