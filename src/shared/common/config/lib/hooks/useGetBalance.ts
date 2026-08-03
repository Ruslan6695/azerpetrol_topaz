import { userApi } from '../../../api/userApi'
import { UserStore } from '../../../model/userStore'
import { useFetchData } from './useFetchData'
import { useFetchStoreData } from './useFetchStoreData'

export function useGetBalance() {
    const balance = UserStore.useBalance()
    const bonusBalance = UserStore.useBonus_balance()
    const { fetchData, isDataLoading } = useFetchStoreData<{
        balance: number
        bonus_balance: number
    }>({
        apiCallback: userApi.getBalance,
        errorText: 'Не удалось получить баланс',
        setData: UserStore.useSetBalance(),
    })
    return {
        balance,
        bonusBalance,
        fetchBalance: fetchData,
        isBalanceLoading: isDataLoading,
    }
}
