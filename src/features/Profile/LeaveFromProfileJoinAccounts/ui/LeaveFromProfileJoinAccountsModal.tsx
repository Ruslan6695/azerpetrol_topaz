import { memo, useCallback } from 'react'
import { useSendFetch } from '../../../../shared'
import { ConfirmDialog } from '../../../../shared/ConfirmDialog'
import { leaveFromProfileJoinAccountsApi } from '../api/leaveFromProfileJoinAccountsApi'

type Props = {
    handleClose: () => void
    isOpened: boolean
    onLeave: () => void
}

export const LeaveFromProfileJoinAccountsModal = memo(
    ({ handleClose, isOpened, onLeave }: Props) => {
        const { isSendFetchLoading, sendFetch } = useSendFetch({
            apiCallback: leaveFromProfileJoinAccountsApi.leave,
            errorText: 'Ошибка при выходе из группы',
        })

        const handleSubmit = useCallback(() => {
            sendFetch({
                args: undefined,
                afterDataCallback() {
                    onLeave()
                },
                finalyCallback() {
                    handleClose()
                },
            })
        }, [sendFetch, onLeave, handleClose])

        return (
            <ConfirmDialog
                isOpened={isOpened}
                onClose={handleClose}
                onConfirm={handleSubmit}
                title="Покинуть группу?"
                description="Вы потеряете доступ к общему счёту и его бонусам."
                confirmLabel="Покинуть"
                loading={isSendFetchLoading}
            />
        )
    }
)
