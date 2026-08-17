import { memo } from 'react'
import { CenteredState } from '../../../shared/CenteredState'
import { TPillButtonVariants } from '../../../shared/PillButton'

type Props = {
    message: string
    onReload?: () => void
    /** Подпись кнопки. По умолчанию «Попробовать снова» */
    buttonText?: string
    /** 'primary' — когда кнопка ведёт вперёд, а не повторяет запрос */
    buttonVariant?: TPillButtonVariants
}

// Состояние ошибки загрузки — общее для всех экранов. Геометрию, круг и
// кнопку целиком держит CenteredState, поэтому своих отступов здесь нет:
// раньше каждое место вызова подгоняло форму своими margins.
export const ErrorWhileFetchingForm = memo(
    ({ message, onReload, buttonText, buttonVariant }: Props) => {
        return (
            <CenteredState
                variant="error"
                title={message}
                action={
                    onReload && {
                        label: buttonText ?? 'Попробовать снова',
                        onPress: onReload,
                        variant: buttonVariant,
                    }
                }
            />
        )
    }
)
