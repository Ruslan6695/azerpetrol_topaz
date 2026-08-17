import { memo } from 'react'
import { CenteredState } from '../../../shared/CenteredState'

type Props = {}

// Заглушка нереализованного раздела. Маршрут /products в ESCREENS есть,
// но переходов на него в приложении сейчас нет ни одного.
export const DevelopmentInProgressWidget = memo((props: Props) => {
    return (
        <CenteredState
            variant="empty"
            title="Раздел в разработке"
            description="Мы ещё работаем над этой частью приложения"
        />
    )
})
