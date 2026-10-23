import axios from 'axios'
import { Platform } from 'react-native'
import { APP_VERSION } from '../config/constants/APP_VERSION'
import { AppStore } from '../model/appStore'

export const axiosIntsanse = axios.create({
    baseURL: 'https://topaz.poteryashka.pro/adapters/primary/mobile_app/',
    // По версии сервер решает, не устарело ли приложение (минимальная версия
    // задаётся в панели); платформа — какую ссылку на обновление отдать.
    headers: {
        'X-App-Version': APP_VERSION,
        'X-App-Platform': Platform.OS,
    },
})

// 426 — версия ниже минимальной: показываем экран обновления. Из аккаунта
// не выходим — после обновления клиент продолжит с того же места. Ошибку
// пробрасываем дальше, чтобы вызвавший код не принял ответ за успех.
axiosIntsanse.interceptors.response.use(undefined, (error) => {
    if (error?.response?.status === 426) {
        const data = error.response.data ?? {}
        const message = typeof data.message === 'string' ? data.message : ''
        AppStore.getState().setAppUpdate({
            message,
            url: typeof data.url === 'string' ? data.url : '',
        })
        // Тосты ошибок показывают response.data как текст — объект туда не
        // отдаём.
        error.response.data = message
    }
    return Promise.reject(error)
})
