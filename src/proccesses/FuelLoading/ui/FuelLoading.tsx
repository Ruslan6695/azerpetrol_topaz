import { memo, useCallback, useState } from 'react'
import { FuelLoadingStartWidget } from '../../../widgets/FuelLoading/FuelLoadingStartWidget'
import { FuelLoadingFuellingWidget } from '../../../widgets/FuelLoading/FuelLoadingFuellingWidget'
import { FuelLoadingEndWidget } from '../../../widgets/FuelLoading/FuelLoadingEndWidget'
import { FuelStore, UserStore, useGetBalance } from '../../../shared'
import { useFocusEffect } from 'expo-router'

type Props = {}

export const FuelLoading = memo((props: Props) => {
    const [road, setRoad] = useState<'start' | 'fuelling' | 'end'>('start')
    const [endVolume, setEndVolume] = useState(0)
    const balance = UserStore.useBalance()
    const trkTypePrice = FuelStore.useState().trkType?.price
    const { fetchBalance } = useGetBalance()
    const handleChangeEndVolume = useCallback((volume: number) => {
        setEndVolume(volume)
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchBalance({ args: undefined, hideToastOnError: true })
        }, [])
    )

    switch (road) {
        case 'start':
            return <FuelLoadingStartWidget setRoad={setRoad} />
        case 'fuelling':
            return (
                <FuelLoadingFuellingWidget
                    onEndFuelling={handleChangeEndVolume}
                    setRoad={setRoad}
                />
            )
        case 'end':
            return (
                <FuelLoadingEndWidget
                    rubles={endVolume * Number(trkTypePrice)}
                    balance={balance - endVolume * Number(trkTypePrice)}
                    volume={endVolume}
                />
            )
    }
})
