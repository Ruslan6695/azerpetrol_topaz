import { IAppUpdate } from '../config/interfaces/IAppUpdate'
import { axiosIntsanse } from './axiosInstanse'

type TAppVersionCheck =
    { update_required: false } | ({ update_required: true } & IAppUpdate)

export const appVersionApi = {
    // Проверка при запуске, без входа: экран обновления увидит и тот, кто
    // ещё не вошёл в аккаунт.
    check: async () => {
        const resp = await axiosIntsanse.get<TAppVersionCheck>('app_version/')
        return resp.data
    },
}
