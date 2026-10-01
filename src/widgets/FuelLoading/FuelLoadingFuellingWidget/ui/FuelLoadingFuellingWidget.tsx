import { useRouter } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { FuelPouringProgress } from '../../../../entities/FuelLoading/FuelPouringProgress'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    EFuellingErrorKind,
    FuelStore,
    IFuellingTotals,
    SIZES,
    SPACING,
    useSendFetch,
} from '../../../../shared'
import { ConfirmDialog } from '../../../../shared/ConfirmDialog'
import { PillButton } from '../../../../shared/PillButton'
import { Typography } from '../../../../shared/Typography'
import { fuelLoadingFuellingApi } from '../api/fuelLoadingFuellingApi'
import { EFuelOrderStatus } from '../config/enums/EFuelOrderStatus'
import { IFuelLoadingFuellingArgs } from '../config/interfaces/IFuelLoadingFuellingArgs'
import {
    FUELLING_STATUS_PENDING_TEXT,
    FUELLING_STATUS_TEXTS,
} from '../config/constants/FUELLING_STATUS_TEXTS'
import { useFuellingPolling } from '../lib/useFuellingPolling'

type Props = {
    onEndFuelling: (totals: IFuellingTotals) => void
    onError: (kind: EFuellingErrorKind, reason?: string) => void
}

export const FuelLoadingFuellingWidget = memo(
    ({ onEndFuelling, onError }: Props) => {
        const router = useRouter()
        const { azs, column, fuelOption, liters, orderId } =
            FuelStore.useState()
        const [isConfirmOpened, setIsConfirmOpened] = useState(false)

        const { status, volume } = useFuellingPolling({
            enabled: Boolean(orderId),
            orderId: orderId ?? '',
            onComplete: onEndFuelling,
            onError,
        })

        // Топаз ставит Fueling, как только разрешил колонку, ещё до снятия
        // пистолета — поэтому отмена доступна, пока счётчик на нуле. Когда
        // литры пошли, сервер отказывает (core/mobile/topaz_cancel_fuelling.php):
        // остановить налив можно только повесив пистолет, спишется налитое.
        const isPouring = status === EFuelOrderStatus.FUELING && volume > 0

        const { sendFetch, isSendFetchLoading } =
            useSendFetch<IFuelLoadingFuellingArgs, void>({
                apiCallback: fuelLoadingFuellingApi.cancel,
                errorText: 'Не удалось отменить налив',
            })

        // Отмену подтверждаем и ждём ответа: пока заказ ждал колонку, Топаз
        // мог перевести его в Fueling — тогда сервер откажет, и клиент должен
        // увидеть причину, а не уйти с экрана с ощущением, что всё отменилось.
        const handleConfirmCancel = useCallback(async () => {
            if (!orderId) return

            await sendFetch({
                args: { orderId },
                afterDataCallback() {
                    setIsConfirmOpened(false)
                    router.back()
                },
                onErrorCallback() {
                    setIsConfirmOpened(false)
                },
            })
        }, [orderId, sendFetch, router])

        const handleOpenConfirm = useCallback(() => {
            setIsConfirmOpened(true)
        }, [])

        const handleCloseConfirm = useCallback(() => {
            setIsConfirmOpened(false)
        }, [])

        // «←» раньше молча отменял заказ — случайное нажатие стоило налива.
        // Теперь, пока топливо не пошло, он ведёт в то же подтверждение, а во
        // время налива просто уводит с экрана: заказ доливается и спишется
        // по факту.
        const handleGoBack = useCallback(() => {
            if (isPouring) {
                router.back()
                return
            }
            setIsConfirmOpened(true)
        }, [isPouring, router])

        const styles = StyleSheet.create({
            actions: {
                marginTop: SPACING.XL * SIZES.PX,
                gap: SPACING.SM * SIZES.PX,
            },
        })

        if (!azs || !column || !fuelOption || !liters || !orderId) return null

        const statusText = status
            ? (FUELLING_STATUS_TEXTS[status] ?? FUELLING_STATUS_PENDING_TEXT)
            : FUELLING_STATUS_PENDING_TEXT

        return (
            <>
                <StepHeader title="Идёт налив" onBack={handleGoBack} />
                <FuelPouringProgress
                    volume={volume}
                    target={liters}
                    statusText={statusText}
                    details={`Колонка ${column.id} · ${fuelOption.name} · не отходите от авто`}
                />

                <View style={styles.actions}>
                    <PillButton
                        title="Отменить налив"
                        variant="secondary"
                        onPress={handleOpenConfirm}
                        disabled={isPouring}
                        loading={isSendFetchLoading}
                    />
                    {isPouring && (
                        <Typography
                            type="caption11"
                            color="secondary"
                            textAlign="center"
                        >
                            Налив уже начался — чтобы остановить, повесьте
                            пистолет. Спишется только налитое.
                        </Typography>
                    )}
                </View>

                <ConfirmDialog
                    isOpened={isConfirmOpened}
                    onClose={handleCloseConfirm}
                    onConfirm={handleConfirmCancel}
                    title="Отменить налив?"
                    description="Заказ будет отменён, зарезервированная сумма вернётся на баланс."
                    confirmLabel="Отменить налив"
                    cancelLabel="Продолжить"
                    loading={isSendFetchLoading}
                />
            </>
        )
    }
)
