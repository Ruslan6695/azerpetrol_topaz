import { memo, useCallback, useEffect } from 'react'
import { SIZES, useFetchData } from '../../../shared'
import { promotionsAndBonusesWidgetApi } from '../api/promotionsAndBonusesWidgetApi'
import { CustomText } from '../../../shared/CustomText'
import { ScreenTitle } from '../../../entities/ScreenTitle'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import Skeleton from '../../../shared/Skeleton/ui/Skeletons'
import { PromotionsAndBonusesItem } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { WithoutPromotionsAndBonusesBlock } from '../../../entities/PromotionsAndBonuses/WithoutPromotionsAndBonusesBlock'

type Props = {}

export const PromotionsAndBonusesWidget = memo((props: Props) => {
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: promotionsAndBonusesWidgetApi.getPromotions,
        errorText: 'Ошибка при получении данных',
    })

    const handleReloadData = useCallback(() => {
        fetchData({
            args: undefined,
            hideToastOnError: true,
        })
    }, [])

    useEffect(() => {
        handleReloadData()
    }, [])

    return (
        <>
            <ScreenTitle title="Акции и бонусы" />
            {errorText ? (
                <ErrorWhileFetchingForm
                    margins={{ mt: 100 }}
                    onReload={handleReloadData}
                    message={errorText}
                />
            ) : isDataLoading ? (
                <View style={styles.promotions}>
                    {[1, 2, 3].map((pr) => (
                        <Skeleton
                            key={pr}
                            height={155 * SIZES.PX}
                            width={SIZES.WIDTH(1) - SIZES.PX * 40}
                        />
                    ))}
                </View>
            ) : (
                <View style={styles.promotions}>
                    {data?.promotions.length === 0 ? (
                        <WithoutPromotionsAndBonusesBlock />
                    ) : (
                        data?.promotions?.map((pr) => (
                            <PromotionsAndBonusesItem {...pr} key={pr.id} />
                        ))
                    )}
                </View>
            )}
        </>
    )
})
const styles = StyleSheet.create({
    promotions: {
        gap: SIZES.PX * 10,
    },
})
