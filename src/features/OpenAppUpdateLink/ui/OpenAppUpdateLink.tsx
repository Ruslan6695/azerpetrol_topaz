import { memo, useCallback } from 'react'
import { Linking } from 'react-native'
import { MPLayout } from '../../../shared/MpLayout'
import { PillButton } from '../../../shared/PillButton'

type Props = { url: string }

// Переход по ссылке на новую версию приложения (задаётся в панели).
export const OpenAppUpdateLink = memo(({ url }: Props) => {
    const handleOpen = useCallback(() => {
        Linking.openURL(url).catch(() => {})
    }, [url])

    return (
        <MPLayout ph={20} mt={24}>
            <PillButton
                title="Обновить"
                variant="primary"
                fullWidth
                onPress={handleOpen}
            />
        </MPLayout>
    )
})
