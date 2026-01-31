import { memo, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { PromotionsAndBonusesItem } from '../../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { AppStore, SIZES, useFetchData } from '../../../../shared'
import { ShowPromotionsModalStore } from '../../../ShowPromotionsModal'
import { showMainPromotionsApi } from '../api/showMainPromotionsApi'

type Props = {}

export const ShowMainPromotions = memo((props: Props) => {
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
    return (
        <>
            {data?.promotions?.map((pr) => (
                <PromotionsAndBonusesItem {...pr} key={pr.id} />
            ))}
        </>
    )
})

const styles = StyleSheet.create({
    promotions: {
        gap: SIZES.PX * 10,
    },
})
