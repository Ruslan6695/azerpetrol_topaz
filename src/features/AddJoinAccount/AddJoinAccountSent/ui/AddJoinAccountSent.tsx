import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'

// Финал приглашения из макета (showInviteSent). Профиль сам перезагрузит
// список связанных аккаунтов — он грузит данные через useFocusEffect.
export const AddJoinAccountSent = memo(() => {
    const router = useRouter()

    const handleGoToProfile = useCallback(() => {
        router.navigate(ESCREENS.PROFILE)
    }, [router])

    return (
        <CenteredState
            variant="success"
            title="Приглашение отправлено"
            description="Как только пользователь примет приглашение, он появится в списке связанных аккаунтов."
            action={{ label: 'В профиль', onPress: handleGoToProfile }}
        />
    )
})
