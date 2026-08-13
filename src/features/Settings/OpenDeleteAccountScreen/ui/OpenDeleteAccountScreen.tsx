import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { Icon } from '../../../../shared/Icons'
import { ListGroup, ListRow } from '../../../../shared/ListRow'

export const OpenDeleteAccountScreen = memo(() => {
    const router = useRouter()

    const handleOpen = useCallback(() => {
        router.navigate(ESCREENS.DELETE_ACCOUNT)
    }, [router])

    return (
        <ListGroup>
            {/* Иконку передаём узлом: ListRow по имени рисует 24, в макете 22 */}
            <ListRow
                title="Удалить аккаунт"
                left={<Icon name="profile_delete_acc" size={22} />}
                destructive
                last
                onPress={handleOpen}
            />
        </ListGroup>
    )
})
