import { memo } from 'react'
import { CenteredState } from '../../../../shared/CenteredState'

type Props = {}

// Пустого экрана акций в макете «21 Век» нет — берём общий паттерн
// центрированного состояния, как у соседнего WithoutNewsBlock.
export const WithoutPromotionsAndBonusesBlock = memo((props: Props) => {
    return (
        <CenteredState
            variant="empty"
            title="Активных акций пока нет"
            description="Здесь появятся акции и бонусные программы компании"
        />
    )
})
