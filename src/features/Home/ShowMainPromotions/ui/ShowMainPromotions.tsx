import { useRouter } from 'expo-router'
import { memo, useEffect } from 'react'
import {
    HomePromotionCard,
    IPromotionsAndBonusesItem,
} from '../../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { AppStore, ESCREENS, useFetchData } from '../../../../shared'
import { ShowPromotionsModalStore } from '../../../ShowPromotionsModal'
import { showMainPromotionsApi } from '../api/showMainPromotionsApi'

type Props = {}

export const ShowMainPromotions = memo((props: Props) => {
    const router = useRouter()
    const setModalPromotions = ShowPromotionsModalStore.useSetPromotions()
    const { data, fetchData, setData } = useFetchData({
        apiCallback: showMainPromotionsApi.getPromotions,
        errorText: 'Ошибка при получении акций',
    })

    const isTokenRefreshed = AppStore.useIsTokenRefreshed()

    useEffect(() => {
        if (isTokenRefreshed)
            fetchData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    setData({
                        promotions: data.promotions.filter(
                            (prom) => prom.show_main === true
                        ),
                    })
                    setModalPromotions(
                        data.promotions.filter(
                            (prom) => prom.show_modal === true
                        )
                    )
                },
            })
    }, [isTokenRefreshed])

    const handlePress = (promotion: IPromotionsAndBonusesItem) => () => {
        router.navigate({
            pathname: ESCREENS.PROMOTIONS_AND_BONUSES_DETAILS,
            params: {
                date_create: promotion.date_create,
                html_text: promotion.html_text,
                img: promotion.img,
                header: promotion.header,
                page_link: promotion.page_link,
            },
        })
    }

    return (
        <>
            {data?.promotions?.map((pr) => (
                <HomePromotionCard
                    {...pr}
                    key={pr.id}
                    onPress={handlePress(pr)}
                />
            ))}
        </>
    )
})
