import { memo } from 'react'
import { CenteredState } from '../../../shared/CenteredState'

type Props = {}

// Оффлайн-состояние: подставляется вместо содержимого в обоих лэйаутах,
// поэтому это единственный вид приложения без сети. Отдельной иконки не
// берём — у состояния ошибки в макете круг с «!», его и даёт CenteredState.
export const CheckNetworkWidget = memo((props: Props) => {
    return (
        <CenteredState
            variant="error"
            title="Нет подключения к интернету"
            description="Проверьте соединение — данные загрузятся автоматически"
        />
    )
})
