import { useCallback, useState } from 'react'
import { ITabWithBackground } from '../../config/interfaces/ITabWithBackground'

export function useTabBar(defaultValue?: ITabWithBackground) {
    const [selectedTab, setSelectedTab] =
        useState<ITabWithBackground | undefined>(defaultValue || undefined)

    const handleChangeSelectedTab = useCallback((tab: ITabWithBackground) => {
        setSelectedTab(tab)
    }, [])
    return { selectedTab, setSelectedTab, handleChangeSelectedTab }
}
