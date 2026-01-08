import { useCallback, useState } from 'react'
import { ITab } from '../../config/interfaces/ITab'

export function useTabBar(defaultValue?: ITab) {
    const [selectedTab, setSelectedTab] = useState<ITab | undefined>(
        defaultValue || undefined
    )

    const handleChangeSelectedTab = useCallback((tab: ITab) => {
        setSelectedTab(tab)
    }, [])
    return { selectedTab, setSelectedTab, handleChangeSelectedTab }
}
