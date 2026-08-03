import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { PillButton } from '../../../../shared/PillButton'

type Props = {}

export const OpenTransferBalanceScreen = memo((props: Props) => {
    const router = useRouter()
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.TRANSFER_BALANCE)
    }, [router])

    return (
        <PillButton
            title="Перевести"
            size="md"
            variant="secondary"
            fullWidth={false}
            onPress={handlePress}
            style={{ flex: 1 }}
        />
    )
})
