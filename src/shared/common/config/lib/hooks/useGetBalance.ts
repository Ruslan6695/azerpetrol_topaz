import { userApi } from '../../../api/userApi'
import { UserStore } from '../../../model/userStore'
import { useFetchData } from './useFetchData'
import { useFetchStoreData } from './useFetchStoreData'

export function useGetBalance() {
    const balance = UserStore.useBalance()
    const { fetchData, isDataLoading } = useFetchStoreData<{
        balance: number
    }>({
        apiCallback: userApi.getBalance,
        errorText: 'Не удалось получить баланс',
        setData: UserStore.useSetBalance(),
    })
    return { balance, fetchBalance:fetchData, isBalanceLoading: isDataLoading }
}
