import { ReactNode, memo, useCallback, useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../entities/ErrorWhileFetchingForm'
import {
    EHistoryItemType,
    THistoryDetailsScreenParams,
} from '../../../entities/History'
import { HistoryDetailsTitle } from '../../../entities/History/HistoryDetailsTitle'
import {
    OpenHistoryDetailsBuyOnCash,
    OpenHistoryDetailsBuyOnCashSkeleton,
    OpenHistoryDetailsPayBalance,
    OpenHistoryDetailsTransferBalance,
    OpenHistoryDetailsTransferBalanceSkeleton,
} from '../../../features/History/OpenHistoryDetails'
import { OpenHistoryDetailsPayBalanceSkeleton } from '../../../features/History/OpenHistoryDetails/ui/OpenHistoryDetailsPayBalanceSkeleton'
import { SIZES, useFetchData } from '../../../shared'
import Skeleton from '../../../shared/Skeleton/ui/Skeletons'
import { Typography } from '../../../shared/Typography'
import { historyDetailsWidgetApi } from '../api/historyDetailsWidgetApi'

type Props = {
    params: Partial<THistoryDetailsScreenParams>
}

export const HistoryDetailsWidget = memo(({ params }: Props) => {
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: historyDetailsWidgetApi.getDetails,
        errorText: 'Ошибка при получении данных',
    })

    const handleReloadData = useCallback(() => {
        if (params.id && params.type) {
            fetchData({
                args: { historyId: params.id, type: params.type },
                hideToastOnError: true,
            })
        }
    }, [params])

    const children = useMemo<ReactNode>(() => {
        //@ts-ignore
        switch (+params.type) {
            case EHistoryItemType.PAY_BALANCE:
                if (isDataLoading) {
                    return <OpenHistoryDetailsPayBalanceSkeleton />
                } else {
                    if (data)
                        return <OpenHistoryDetailsPayBalance sum={data?.sum} />
                }

            case EHistoryItemType.BUY_ON_CASH:
                if (isDataLoading) {
                    return <OpenHistoryDetailsBuyOnCashSkeleton />
                } else {
                    if (data && data.products)
                        return (
                            <OpenHistoryDetailsBuyOnCash
                                total={data.sum}
                                products={data.products.map((prod) => ({
                                    name: prod.product_name,
                                    price_one: prod.sale / prod.count,
                                    sum: prod.sale,
                                    unit: {
                                        count: prod.count,
                                        name: prod.unit_name,
                                    },
                                }))}
                            />
                        )
                }

            case EHistoryItemType.BUY_COFFEE:
                if (isDataLoading) {
                    return <OpenHistoryDetailsBuyOnCashSkeleton />
                } else {
                    if (data && data.coffee_name)
                        return (
                            <OpenHistoryDetailsBuyOnCash
                                total={data.sum}
                                products={[
                                    {
                                        name: data.coffee_name,
                                        price_one: data.sum,
                                        sum: data.sum,
                                        unit: { count: 1, name: 'шт.' },
                                    },
                                ]}
                            />
                        )
                }

            case EHistoryItemType.TRANSFER_BALANCE:
                if (isDataLoading) {
                    return <OpenHistoryDetailsTransferBalanceSkeleton />
                } else {
                    if (data && data.receiver_name && data.receiver_phone)
                        return (
                            <OpenHistoryDetailsTransferBalance
                                info={{
                                    sum: data.sum,
                                    transfer_name: data?.receiver_name,
                                    transfer_phone: data?.receiver_phone,
                                }}
                            />
                        )
                }

            case EHistoryItemType.FUEL_FILLING:
                if (isDataLoading) {
                    return <OpenHistoryDetailsBuyOnCashSkeleton />
                } else {
                    if (data && data.petrol)
                        return (
                            <OpenHistoryDetailsBuyOnCash
                                total={data.sum}
                                products={[
                                    {
                                        name: data.petrol.name,
                                        price_one: data.petrol.price,
                                        sum: data.sum,
                                        unit: {
                                            count: data.petrol.liters,
                                            name: 'л.',
                                        },
                                    },
                                ]}
                            />
                        )
                }
        }
        return <></>
    }, [params.type, data, isDataLoading])

    useEffect(() => {
        handleReloadData()
    }, [params])

    if (errorText) {
        return (
            <ErrorWhileFetchingForm
                margins={{ mt: 100 }}
                onReload={handleReloadData}
                message={errorText}
            />
        )
    }
    return (
        <View>
            {isDataLoading ? (
                <Skeleton
                    margins={{ mb: 10 }}
                    width={150 * SIZES.PX}
                    height={30 * SIZES.PX}
                />
            ) : (
                <Typography
                    marginsPaddings={{ mb: 10 }}
                    type="bodyAccentMedium"
                >
                    {data?.text}
                </Typography>
            )}

            <View style={styles.row}>
                {isDataLoading ? (
                    <>
                        <Skeleton
                            width={160 * SIZES.PX}
                            height={15 * SIZES.PX}
                        />
                        <Skeleton
                            width={120 * SIZES.PX}
                            height={30 * SIZES.PX}
                        />
                    </>
                ) : (
                    <>
                        <Typography type="caption">{data?.date}</Typography>

                        <HistoryDetailsTitle
                            //@ts-ignore
                            type={+params.type}
                        />
                    </>
                )}
            </View>
            {children}
        </View>
    )
})

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
