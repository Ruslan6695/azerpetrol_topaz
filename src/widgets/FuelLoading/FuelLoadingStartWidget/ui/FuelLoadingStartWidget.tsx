import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    FuelStore,
    SIZES,
    TFuelLoadingRoad,
    useSendFetch,
} from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { Icon } from '../../../../shared/Icons'
import { fuelLoadingStartApi } from '../api/fuelLoadingStartApi'

type Props = {
    setRoad: React.Dispatch<React.SetStateAction<TFuelLoadingRoad>>
}

export const FuelLoadingStartWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()
    const { azs, column, fuelOption, liters, rubles } = FuelStore.useState()
    const changeOrderId = FuelStore.useChangeOrderId()
    const { sendFetch, isSendFetchLoading, errorText } = useSendFetch({
        apiCallback: fuelLoadingStartApi.startFuelling,
        errorText: 'Не удалось начать налив',
    })

    const handleStartFuelling = useCallback(async () => {
        if (!azs || !column || !fuelOption || !rubles) return

        await sendFetch({
            args: {
                azsId: azs.id,
                columnId: column.id,
                fuelId: fuelOption.fuelId,
                price: fuelOption.price,
                sumRub: rubles,
            },
            hideToastOnError: true,
            afterDataCallback(data) {
                changeOrderId(data.orderId)
                setRoad('fuelling')
            },
        })
    }, [azs, column, fuelOption, rubles, sendFetch, changeOrderId, setRoad])

    const handleCancel = useCallback(() => {
        router.back()
    }, [router])

    const styles = StyleSheet.create({
        container: {
            minHeight: SIZES.HEIGHT(0.7),
        },
    })

    if (!azs || !column || !fuelOption || !liters || !rubles) return null

    return (
        <>
            <StepHeader title="Запуск налива" onBack={handleCancel} />
            <View style={styles.container}>
                <CenteredState
                    icon={<Icon name="tab_fuel" size={44} />}
                    title="Готовы начать налив?"
                    description={`${azs.name} · Колонка ${column.id} · ${fuelOption.name} · ${liters.toFixed(1)} л на ${rubles} ₽`}
                    error={errorText}
                    action={{
                        label: 'Запустить колонку',
                        onPress: handleStartFuelling,
                        variant: 'primary',
                        loading: isSendFetchLoading,
                    }}
                    secondaryAction={{
                        label: 'Отмена',
                        onPress: handleCancel,
                    }}
                />
            </View>
        </>
    )
})
