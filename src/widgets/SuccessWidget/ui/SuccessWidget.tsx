import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ESCREENS, SIZES, TSuccessScreenParams } from '../../../shared'
import { CenteredState } from '../../../shared/CenteredState'

type Props = {
    params: Partial<TSuccessScreenParams>
}

const DEFAULT_DESCRIPTION =
    'Операция выполнена успешно. Баланс обновится в течение минуты.'

// CenteredState растягивается по flex, а экран лежит внутри скролла —
// без минимальной высоты состояние прижалось бы к шапке.
const styles = StyleSheet.create({
    container: {
        minHeight: SIZES.HEIGHT(0.7),
    },
})

export const SuccessWidget = memo(({ params }: Props) => {
    const router = useRouter()
    // Куда возвращаемся, решает вызывающий экран: с пополнения при нехватке
    // средств это топливо, во всех остальных случаях — главная.
    const link = params.link || ESCREENS.HOME

    const goNext = useCallback(() => {
        router.navigate(link)
    }, [link])

    return (
        <View style={styles.container}>
            <CenteredState
                variant="success"
                title="Готово!"
                description={params.text || DEFAULT_DESCRIPTION}
                action={{
                    label: link === ESCREENS.HOME ? 'На главную' : 'Продолжить',
                    onPress: goNext,
                }}
            />
        </View>
    )
})
