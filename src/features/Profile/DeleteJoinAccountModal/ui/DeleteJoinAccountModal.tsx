import { memo, useCallback } from 'react'
import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'
import { useSendFetch } from '../../../../shared'
import { ConfirmDialog } from '../../../../shared/ConfirmDialog'
import { deleteJoinAccountApi } from '../api/deleteJoinAccountApi'

type Props = {
    isOpened: boolean
    handleClose: () => void
    deletingAccount: IProfileJoinAccountItem
    onDeleteAccount: () => void
}

export const DeleteJoinAccountModal = memo(
    ({ isOpened, handleClose, deletingAccount, onDeleteAccount }: Props) => {
        const { isSendFetchLoading, sendFetch } = useSendFetch({
            apiCallback: deleteJoinAccountApi.delete,
            errorText: 'Ошибка при удалении аккаунта',
        })

        const handleSubmit = useCallback(() => {
            sendFetch({
                args: { accountId: deletingAccount.id },
                afterDataCallback() {
                    onDeleteAccount()
                },
                finalyCallback() {
                    handleClose()
                },
            })
        }, [sendFetch, deletingAccount, onDeleteAccount, handleClose])

        return (
            <ConfirmDialog
                isOpened={isOpened}
                onClose={handleClose}
                onConfirm={handleSubmit}
                title={`Удалить «${deletingAccount.name}»?`}
                description="Пользователь потеряет доступ к общему счёту и его бонусам."
                confirmLabel="Удалить"
                loading={isSendFetchLoading}
            />
        )
    }
)
