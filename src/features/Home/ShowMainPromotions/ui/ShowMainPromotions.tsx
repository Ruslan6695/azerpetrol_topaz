import { memo, useEffect } from 'react'
import { SIZES, useFetchData } from '../../../../shared'
import { showMainPromotionsApi } from '../api/showMainPromotionsApi'
import { StyleSheet } from 'react-native'
import { PromotionsAndBonusesItem } from '../../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'

type Props = {}

export const ShowMainPromotions = memo((props: Props) => {
    const { data, fetchData, setData } = useFetchData({
        apiCallback: showMainPromotionsApi.getPromotions,
        errorText: 'Ошибка при получении акций',
    })

    useEffect(() => {
        fetchData({
            args: undefined,
            hideToastOnError: true,
            afterDataCallback(data) {
                setData({
                    promotions: data.promotions.filter(
                        (prom) => prom.show_main === true
                    ),
                })
            },
        })
    }, [])
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
