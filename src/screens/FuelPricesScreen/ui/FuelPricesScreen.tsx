import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { FuelPricesWidget } from '../../../widgets/FuelPricesWidget'

type Props = {}

export const FuelPricesScreen = memo((props: Props) => {
    return (
        <InternalPagesLayout>
            <FuelPricesWidget />
        </InternalPagesLayout>
    )
})
