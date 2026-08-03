import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { SectionTitle } from '../../../../shared/SectionTitle'

type Props = {}

// Заголовок секции новостей с переходом на полный список.
export const OpenNewsScreen = memo((props: Props) => {
    const router = useRouter()
    // /news лежит внутри (main), поэтому navigate — экран открывается
    // без кнопки «назад», как в макете.
    const handlePress = useCallback(() => {
        router.navigate(ESCREENS.NEWS)
    }, [router])

    return (
        <SectionTitle action={{ label: 'Все →', onPress: handlePress }}>
            Новости
        </SectionTitle>
    )
})
