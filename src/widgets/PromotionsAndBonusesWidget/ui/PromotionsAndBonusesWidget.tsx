import { memo, useCallback, useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import { PromotionsAndBonusesItem } from '../../../entities/PromotionsAndBonuses/PromotionsAndBonusesItem'
import { WithoutPromotionsAndBonusesBlock } from '../../../entities/PromotionsAndBonuses/WithoutPromotionsAndBonusesBlock'
import { RADII, SIZES, SPACING, useFetchData } from '../../../shared'
import { Skeleton } from '../../../shared/Skeleton'
import { promotionsAndBonusesWidgetApi } from '../api/promotionsAndBonusesWidgetApi'

type Props = {}

// Высота карточки акции с картинкой (PromotionImageCard) — скелетон повторяет
// её вместе с радиусом, иначе список дёргается в момент подмены загрузки.
const CARD_HEIGHT = 150

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
    }, [fetchData])

    useEffect(() => {
        handleReloadData()
    }, [handleReloadData])

    const styles = useMemo(
        () =>
            StyleSheet.create({
                promotions: {
                    gap: SPACING.MD * SIZES.PX,
                },
                skeleton: {
                    borderRadius: RADII.CARD * SIZES.PX,
                },
            }),
        []
    )

    return (
        <>
            {/* Заголовок «Акции и Бонусы» рисует шапка экрана
                (InternalPagesHeader через SCREENS_TITLES) — свой не нужен. */}
            {errorText ? (
                <ErrorWhileFetchingForm
                    onReload={handleReloadData}
                    message={errorText}
                />
            ) : isDataLoading ? (
                <View style={styles.promotions}>
                    {[1, 2, 3].map((pr) => (
                        <Skeleton
                            key={pr}
                            height={CARD_HEIGHT * SIZES.PX}
                            width={SIZES.WIDTH(1) - SIZES.PX * 40}
                            style={styles.skeleton}
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
