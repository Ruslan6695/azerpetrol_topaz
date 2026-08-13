import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { ESCREENS } from '../../../../shared'
import { IPromotionsAndBonusesItem } from '../config/interfaces/IPromotionsAndBonusesItem'
import { HomePromotionCard } from './HomePromotionCard'

interface IProps extends IPromotionsAndBonusesItem {}

// Акция в списке экрана /bonuses и в карусели стартовой модалки. Вид карточки
// общий с главной — им заведует HomePromotionCard, здесь только переход.
export const PromotionsAndBonusesItem = memo((props: IProps) => {
    const router = useRouter()
    const { date_create, html_text, img, header, page_link } = props

    const handlePress = useCallback(() => {
        router.navigate({
            pathname: ESCREENS.PROMOTIONS_AND_BONUSES_DETAILS,
            params: { date_create, html_text, img, header, page_link },
        })
    }, [router, date_create, html_text, img, header, page_link])

    return <HomePromotionCard {...props} onPress={handlePress} />
})
