import { memo } from 'react'
import { PromotionsAndBonusesWidget } from '../../../widgets/PromotionsAndBonusesWidget'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'

type Props = {}

export const PromotionsAndBonusesScreen = memo((props: Props) => {
    return (
        <InternalPagesLayout>
            <PromotionsAndBonusesWidget />
        </InternalPagesLayout>
    )
})
