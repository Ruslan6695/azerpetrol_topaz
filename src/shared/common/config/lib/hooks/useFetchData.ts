import { useCallback, useState } from 'react'
import { showError } from '../../../../ToastComponent'
import { UserStore } from '../../../model/userStore'
import { EResponseStatuses } from '../../enums/EResponseStatuses'

export function useFetchData<T, R = undefined>({
    apiCallback,
    errorText,
    defaultDataValue,
    defaultLoading,
}: {
    apiCallback: (args: R) => Promise<T>
    errorText: string
    defaultDataValue?: T
    defaultLoading?: boolean
}) {
    const logout = UserStore.useLogout()

    const [data, setData] = useState<T | undefined>(
        defaultDataValue || undefined
    )
    const [error, setError] = useState<string | null>('')
    const [isDataLoading, setIsDataLoading] = useState(
        defaultLoading !== undefined ? defaultLoading : true
    )

    const fetchData = useCallback(
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
                setData(resp)
                //@ts-ignore
                setError(null)
                afterDataCallback && afterDataCallback(resp) // ОСТОРОЖНО С ИСПОЛЬЗОВАНИЕМ СНАРУЖИ. Не мутируйте объект, который передаете
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

    return {
        fetchData,
        isDataLoading,
        data,
        setData,
        errorText: error,
        setErrorText: setError,
    }
}
