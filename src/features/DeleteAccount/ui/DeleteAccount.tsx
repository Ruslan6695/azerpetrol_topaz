import { useRouter } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { RADII, SIZES, SPACING, UserStore, useSendFetch } from '../../../shared'
import { CenteredState } from '../../../shared/CenteredState'
import { GlassCard } from '../../../shared/GlassCard'
import { showToast } from '../../../shared/ToastComponent'
import { Typography } from '../../../shared/Typography'
import { SendSmsCallCodeForm } from '../../SendSmsCallCodeForm'
import { deleteAccountApi } from '../api/deleteAccountApi'

// Удаление аккаунта в два шага на одном экране: подтверждение намерения,
// затем код из звонка или SMS. Второй шаг обязателен — это требование бэка,
// в макете его нет.
export const DeleteAccount = memo(() => {
    const router = useRouter()
    const [callSmsType, setCallSmsType] = useState<'call' | 'sms'>('call')
    const [road, setRoad] = useState<'confirm' | 'sms'>('confirm')
    const logout = UserStore.useLogout()

    const { isSendFetchLoading: isDeleteLoading, sendFetch: sendDelete } =
        useSendFetch({
            apiCallback: deleteAccountApi.delete,
            errorText: 'Произошла ошибка при удалении профиля',
        })
    const {
        isSendFetchLoading: isSendConfirmLoading,
        sendFetch: confirmDelete,
    } = useSendFetch({
        apiCallback: deleteAccountApi.confirm,
        errorText: 'Произошла ошибка при удалении профиля',
    })

    const handleToggleCallSmsType = useCallback(() => {
        sendDelete({
            args: callSmsType === 'sms' ? 1 : 0,
            afterDataCallback() {
                setCallSmsType('sms')
            },
            onErrorCallback() {
                router.back()
            },
        })
    }, [sendDelete, callSmsType, router])

    const handleDelete = useCallback(() => {
        sendDelete({
            args: callSmsType === 'sms' ? 1 : 0,
            afterDataCallback() {
                setRoad('sms')
            },
            onErrorCallback() {
                router.back()
            },
        })
    }, [sendDelete, callSmsType, router])

    // После успеха logout() сам переключает Stack в корневом layout —
    // закрывать экран руками не нужно.
    const handleConfirm = useCallback(
        (smsCode: string) => {
            confirmDelete({
                args: smsCode,
                afterDataCallback() {
                    showToast({
                        text: 'Аккаунт успешно удален',
                        type: 'success',
                    })
                    logout()
                },
            })
        },
        [confirmDelete, logout]
    )

    const handleBack = useCallback(() => {
        router.back()
    }, [router])

    const styles = StyleSheet.create({
        smsContainer: {
            gap: SPACING.MD * SIZES.PX,
        },
    })

    if (road === 'confirm') {
        return (
            <CenteredState
                variant="error"
                circleSize={88}
                title="Удалить аккаунт?"
                description="Все данные и накопленные бонусы будут удалены безвозвратно. Действие необратимо."
                action={{
                    label: 'Удалить навсегда',
                    onPress: handleDelete,
                    variant: 'destructive',
                    loading: isDeleteLoading,
                }}
                secondaryAction={{ label: 'Отмена', onPress: handleBack }}
            />
        )
    }

    return (
        <GlassCard
            variant="glass2"
            radius={RADII.HERO_SM}
            padding={SPACING.SCREEN}
        >
            {/* SendSmsCallCodeForm возвращает фрагмент без своих отступов —
                зазор между заголовком и формой задаём контейнером. */}
            <View style={styles.smsContainer}>
                <Typography type="num18" textAlign="center">
                    Подтверждение удаления
                </Typography>
                <SendSmsCallCodeForm
                    confirmationType={callSmsType}
                    onToggleConfirmationType={handleToggleCallSmsType}
                    onSend={handleConfirm}
                    isLoading={isSendConfirmLoading}
                />
            </View>
        </GlassCard>
    )
})
