import { memo, useCallback, useEffect, useRef } from 'react'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { ECustomButtonTypes } from '../../../../shared/CustomButton'

type Props = {
    onAllowPermission: () => void
    fetchPermission: () => void
}

export const GetContactsPermission = memo(
    ({ onAllowPermission, fetchPermission }: Props) => {
        const intervalId = useRef<any>(null)

        const handleAllowPermission = useCallback(() => {
            onAllowPermission()
            intervalId.current = setTimeout(() => {
                fetchPermission()
            }, 1000)
        }, [onAllowPermission, fetchPermission])

        useEffect(() => {
            return function () {
                if (intervalId.current) clearInterval(intervalId.current)
            }
        }, [])
        return (
            <ErrorWhileFetchingForm
                buttonProps={{
                    text: 'РАЗРЕШИТЬ',
                    type: ECustomButtonTypes.OUTLINED,
                }}
                onReload={handleAllowPermission}
                message="Для выбора контактов требуется разрешение на использование телефонной книги."
            />
        )
    }
)
