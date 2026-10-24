import { memo } from 'react'
import { ConfirmDialog } from '../../../../shared/ConfirmDialog'

type Props = {
    isOpened: boolean
    onClose: () => void
    // Текст выключателя из панели («Покупка кофе временно недоступна» или свой).
    message: string
}

// Покупка кофе выключена в панели: окно вместо перехода во вкладку «Купить».
export const CoffeeUnavailableDialog = memo(
    ({ isOpened, onClose, message }: Props) => {
        return (
            <ConfirmDialog
                isOpened={isOpened}
                onClose={onClose}
                onConfirm={onClose}
                title="Раздел пока недоступен"
                description={message}
                confirmLabel="Понятно"
                variant="accent"
                hideCancel
            />
        )
    }
)
