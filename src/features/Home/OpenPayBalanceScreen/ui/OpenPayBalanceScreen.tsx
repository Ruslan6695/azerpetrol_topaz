import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { PillButton } from '../../../../shared/PillButton'

type Props = {}

export const OpenPayBalanceScreen = memo((props: Props) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.PAY_BALANCE)
    }, [router])

    return (
        <PillButton
            title="Пополнить"
            size="md"
            variant="primary"
            fullWidth={false}
            onPress={handlePress}
            style={{ flex: 1 }}
        />
    )
})
