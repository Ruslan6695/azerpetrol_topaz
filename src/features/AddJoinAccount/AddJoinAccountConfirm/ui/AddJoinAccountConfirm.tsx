import { memo, useCallback, useEffect, useState } from 'react'
import { useFetchData, useSendFetch } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { Icon } from '../../../../shared/Icons'
import { showError } from '../../../../shared/ToastComponent'
import { addJoinAccountConfirmApi } from '../api/addJoinAccountConfirmApi'
import { IAddJoinAccountGetAccountInfoData } from '../config/IAddJoinAccountGetAccountInfoData'
import { AddJoinAccountConfirmSkeleton } from './AddJoinAccountConfirmSkeleton'

type Props = {
    name?: string
    phone: string
    onGoBack: () => void
    /** Шагами управляет виджет — на успехе он показывает экран «отправлено» */
    onSent: () => void
}

const AVATAR_ICON_SIZE = 44

export const AddJoinAccountConfirm = memo(
    ({ onGoBack, onSent, phone, name }: Props) => {
        const [userName, setUserName] = useState(name || '')
        const { data, errorText, fetchData, isDataLoading } = useFetchData<
            IAddJoinAccountGetAccountInfoData,
            { phone: string }
        >({
            apiCallback: addJoinAccountConfirmApi.getAccountInfo,
            errorText: 'Не удалось получить клиента',
        })
        const { isSendFetchLoading: isInviteLoading, sendFetch: sendInvite } =
            useSendFetch<{
                accountId: number
            }>({
                apiCallback: addJoinAccountConfirmApi.confirm,
                errorText: 'Не удалось отправить приглашение',
            })

        const handleSubmit = useCallback(() => {
            if (data) {
                sendInvite({
                    args: { accountId: data.account.id },
                    afterDataCallback() {
                        onSent()
                    },
                })
            } else {
                showError({
                    text: 'Не удалось получить аккаунт для привязки',
                })
            }
        }, [data, sendInvite, onSent])

        useEffect(() => {
            fetchData({
                args: { phone: phone },
                hideToastOnError: true,
                afterDataCallback(data) {
                    setUserName(data.account.name)
                },
            })
        }, [])

        if (errorText) {
            return (
                <CenteredState
                    variant="error"
                    title="Не удалось найти пользователя"
                    description={errorText}
                    action={{ label: 'Вернуться назад', onPress: onGoBack }}
                />
            )
        }

        if (isDataLoading) {
            return <AddJoinAccountConfirmSkeleton />
        }

        return (
            <CenteredState
                icon={<Icon name="person" size={AVATAR_ICON_SIZE} />}
                title={
                    userName
                        ? `Пригласить ${userName}?`
                        : 'Пригласить пользователя?'
                }
                description={phone}
                action={{
                    label: 'Пригласить',
                    variant: 'primary',
                    onPress: handleSubmit,
                    loading: isInviteLoading,
                }}
                secondaryAction={{
                    label: 'Вернуться назад',
                    onPress: onGoBack,
                }}
            />
        )
    }
)
