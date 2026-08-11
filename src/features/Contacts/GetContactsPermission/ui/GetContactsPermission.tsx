import { memo, useCallback, useEffect, useRef } from 'react'
import { CenteredState } from '../../../../shared/CenteredState'
import { Icon } from '../../../../shared/Icons'

type Props = {
    onAllowPermission: () => void
    fetchPermission: () => void
}

// Системный диалог разрешения закрывается не мгновенно: статус перечитываем
// с задержкой, иначе получаем ещё старое значение.
const PERMISSION_RECHECK_DELAY = 1000

export const GetContactsPermission = memo(
    ({ onAllowPermission, fetchPermission }: Props) => {
        const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

        const handleAllowPermission = useCallback(() => {
            onAllowPermission()
            timeoutId.current = setTimeout(() => {
                fetchPermission()
            }, PERMISSION_RECHECK_DELAY)
        }, [onAllowPermission, fetchPermission])

        useEffect(() => {
            return function () {
                if (timeoutId.current) clearTimeout(timeoutId.current)
            }
        }, [])

        return (
            <CenteredState
                title="Нужен доступ к контактам"
                description="Для выбора контактов требуется разрешение на использование телефонной книги."
                icon={<Icon name="contacts" size={40} />}
                action={{
                    label: 'Разрешить',
                    onPress: handleAllowPermission,
                    variant: 'primary',
                }}
            />
        )
    }
)
