import { memo, useEffect, useMemo, useRef } from 'react'
import { AnimateFuelLoading } from '../../../../features/FuelLoading/AnimateFuelLoading'
import { FuelStore, useFetchData } from '../../../../shared'
import { fuelLoadingFuellingApi } from '../api/fuelLoadingFuellingApi'
import { IFuelLoadingFuellingData } from '../config/interfaces/IFuelLoadingFuellingData'
import { EFuelLoadingFuellingStatuses } from '../config/enums/EFuelLoadingFuellingStatuses'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<'start' | 'fuelling' | 'end'>>
    onEndFuelling: (volume: number) => void
}

export const FuelLoadingFuellingWidget = memo(
    ({ setRoad, onEndFuelling }: Props) => {
        const state = FuelStore.useState()
        const intervalRef = useRef<any>()
        const { data, errorText, fetchData, setErrorText } = useFetchData<
            IFuelLoadingFuellingData,
            { columnDevice: number; azsId: number }
        >({
            apiCallback: fuelLoadingFuellingApi.getStatus,
            errorText: 'Произошла ошибка',
        })
        const procents = useMemo(() => {
            return data ? (data.volume * 100) / Number(state.liters) : 0
        }, [data, state.liters])

        useEffect(() => {
            intervalRef.current = setInterval(() => {
                fetchData({
                    args: {
                        //@ts-ignore
                        azsId: state.azs?.id,
                        //@ts-ignore
                        columnDevice: state.column?.device,
                    },
                    hideToastOnError: true,
                    afterDataCallback(data) {
                        switch (data.status) {
                            case EFuelLoadingFuellingStatuses.ERROR: {
                                setErrorText('Ошибка колонки')
                                break
                            }
                            case EFuelLoadingFuellingStatuses.LOCKED: {
                                setErrorText('Колонка заблокирована')
                                break
                            }
                            case EFuelLoadingFuellingStatuses.COMPLETE: {
                                onEndFuelling(data.volume)
                                setRoad('end')
                                break
                            }
                        }
                    },
                })
            }, 1000)
            return function () {
                if (intervalRef.current) clearInterval(intervalRef.current)
            }
        }, [])

        if (!state.liters || !state.rubles) {
            return <></>
        }
        return (
            <AnimateFuelLoading
                rubles={state.rubles}
                liters={state.liters}
                percent={procents}
                volume={data?.volume}
                trkType={state.trkType}
            />
        )
    }
)
