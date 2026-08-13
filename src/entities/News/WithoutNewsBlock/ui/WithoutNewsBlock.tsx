import { memo } from 'react'
import { CenteredState } from '../../../../shared/CenteredState'

type Props = {}

// Пустого экрана новостей в макете «21 Век» нет — берём его общий паттерн
// центрированного состояния, как на остальных переделанных экранах.
export const WithoutNewsBlock = memo((props: Props) => {
    return (
        <CenteredState
            variant="empty"
            title="Новостей пока нет"
            description="Здесь появятся объявления и события компании"
        />
    )
})
