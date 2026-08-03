import { memo, useMemo } from 'react'
import { BalanceWidget } from '../../../widgets/BalanceWidget'
import { HomeStore } from '../../../widgets/Home/HomeMainWidget'
import { ESCREENS } from '../../../shared'

type Props = {}

export const BalanceScreen = memo((props: Props) => {
    const homeStore = HomeStore.useData()
    const isHidePayButton = useMemo(() => {
        return homeStore?.options.includes(ESCREENS.PAY_BALANCE) ? false : true
    }, [homeStore])
    return <BalanceWidget isHidePayButton={isHidePayButton} />
})
