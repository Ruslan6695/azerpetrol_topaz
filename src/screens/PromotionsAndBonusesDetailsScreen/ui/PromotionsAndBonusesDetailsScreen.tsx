import { memo } from 'react'
import { InternalPagesLayout } from '../../../layouts/InternalPagesLayout'
import { PromotionsAndBonusesDetailsWidget } from '../../../widgets/PromotionsAndBonusesDetailsWidget'
import { useLocalSearchParams } from 'expo-router'
import { TPromotionsAndBonusesScreenParams } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'

type Props = {}

export const PromotionsAndBonusesDetailsScreen = memo((props: Props) => {
    const params = useLocalSearchParams<TPromotionsAndBonusesScreenParams>()

    return (
        <InternalPagesLayout
            disablePaddings={params.page_link ? true : false}
            hideHeader={params.page_link ? true : false}
            hideScroll={params.page_link ? true : false}
        >
            <PromotionsAndBonusesDetailsWidget params={params} />
        </InternalPagesLayout>
    )
})
