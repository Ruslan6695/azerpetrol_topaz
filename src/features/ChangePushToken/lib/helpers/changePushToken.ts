import {
    getItemFromAsyncStorage,
    getPushNotificationToken,
    setItemToAsyncStorage,
} from '../../../../shared'
import { EAsyncStoreKeys } from '../../../../shared/common/config/enums/EAsyncStoreKeys'
import { changePushTokenApi } from '../../api/changePushTokenApi'

export async function changePushToken() {
    const pushToken = await getPushNotificationToken()
    const pushTokenOnServer = await getItemFromAsyncStorage(
        EAsyncStoreKeys.PUSH_TOKEN_ON_SERVER
    )
    if (pushToken && pushToken !== pushTokenOnServer) {
        try {
            await changePushTokenApi.changeToken(pushToken)
            setItemToAsyncStorage({
                key: EAsyncStoreKeys.PUSH_TOKEN_ON_SERVER,
                value: pushToken,
            })
        } catch (error) {}
    }
}
