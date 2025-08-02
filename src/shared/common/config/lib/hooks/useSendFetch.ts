import { useCallback, useState } from 'react'
import { showError } from '../../../../ToastComponent'
import { EResponseStatuses } from '../../enums/EResponseStatuses'
import { UserStore } from '../../../model/userStore'

export function useSendFetch<R = undefined, T = undefined>({
    apiCallback,
    errorText,
    defaultLoading,
}: {
    apiCallback: (args: R) => Promise<T>
    errorText: string
    defaultLoading?: boolean
}) {
    const logout = UserStore.useLogout()
    const [error, setError] = useState<string | null>('')
    const [isDataLoading, setIsDataLoading] = useState(
        defaultLoading !== undefined ? defaultLoading : false
    )

    const sendFetch = useCallback(
        async ({
            args,
            ownSetIsLoading,
            afterDataCallback,
            beforeCallback,
            finalyCallback,
            onErrorCallback,
            hideToastOnError, // если есть этот параметр он не вызовет тост, а запишет ошибку в стейт
            disableSetLoading,
            leaveErrorBeforeLoading,
        }: {
            args: R
            ownSetIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
            beforeCallback?: () => void
            afterDataCallback?: (data: T) => void
            onErrorCallback?: (error: any) => void
            finalyCallback?: () => void
            hideToastOnError?: boolean
            disableSetLoading?: boolean
            leaveErrorBeforeLoading?: boolean
        }) => {
            !leaveErrorBeforeLoading && setError(null)
            beforeCallback && beforeCallback()
            if (!disableSetLoading) {
                ownSetIsLoading ? ownSetIsLoading(true) : setIsDataLoading(true)
            }
            try {
                const resp = await apiCallback(args)
                afterDataCallback && afterDataCallback(resp) // ОСТОРОЖНО С ИСПОЛЬЗОВАНИЕМ СНАРУЖИ. Не мутируйте объект, который передаете
                setError(null)
            } catch (error: any) {
                if (
                    error?.response?.status === EResponseStatuses.INVALID_TOKEN
                ) {
                    logout()
                }
                !hideToastOnError && showError({ error, text: errorText })
                hideToastOnError && setError(error?.response?.data || errorText)
                onErrorCallback && onErrorCallback(error)
            } finally {
                finalyCallback && finalyCallback()
                if (!disableSetLoading) {
                    ownSetIsLoading
                        ? ownSetIsLoading(false)
                        : setIsDataLoading(false)
                }
            }
        },
        [errorText, apiCallback]
    )

    return { sendFetch, isSendFetchLoading: isDataLoading, errorText: error }
}
