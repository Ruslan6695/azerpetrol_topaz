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

// Шаг «Запуск налива» (dc.html:564–572). Разметка целиком ложится
// на CenteredState: круг 96 с иконкой, заголовок, сводка, пара кнопок.
export const FuelLoadingStartWidget = memo(({ setRoad }: Props) => {
    const router = useRouter()
    const { azs, column, trkType, liters, rubles } = FuelStore.useState()
    const { sendFetch, isSendFetchLoading, errorText } = useSendFetch({
        apiCallback: fuelLoadingStartApi.startFuelling,
        errorText: 'Не удалось начать налив',
    })

    const handleStartFuelling = useCallback(async () => {
        // Гард вместо восьми //@ts-ignore: без любого из параметров
        // fuelling/start/ всё равно не примет запрос.
        if (!azs || !column || !trkType || !rubles) return

        await sendFetch({
            args: {
                azsId: azs.id,
                columnDevice: column.device,
                sumRub: rubles,
                trkTypeArt: trkType.art,
                trkTypeName: trkType.name,
                trkTypeNozzleId: trkType.nozzle_id,
                trkTypePetrolId: trkType.petrol_id,
                trkTypePrice: trkType.price,
            },
            // Ошибку колонки показываем текстом на самом экране, а не тостом:
            // сообщения бэка длинные и объясняют, что сделать с пистолетом.
            hideToastOnError: true,
            afterDataCallback() {
                setRoad('fuelling')
            },
        })
    }, [azs, column, trkType, rubles, sendFetch, setRoad])

    const handleCancel = useCallback(() => {
        router.back()
    }, [router])

    const styles = StyleSheet.create({
        // CenteredState тянется по flex, а вокруг — скролл лэйаута:
        // без минимальной высоты состояние прижалось бы к шапке.
        container: {
            minHeight: SIZES.HEIGHT(0.7),
        },
    })

    // Сюда нельзя попасть в обход шагов выбора, но роут внешний —
    // на всякий случай не рендерим сводку из пустого стора.
    if (!azs || !column || !trkType || !liters || !rubles) return null

    return (
        <>
            <StepHeader title="Запуск налива" onBack={handleCancel} />
            <View style={styles.container}>
                <CenteredState
                    icon={<Icon name="tab_fuel" size={44} />}
                    title="Готовы начать налив?"
                    description={`${azs.name} · Колонка ${column.name} · ${trkType.name} · ${liters.toFixed(1)} л на ${rubles} ₽`}
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
