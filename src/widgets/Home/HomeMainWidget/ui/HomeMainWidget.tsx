import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { OpenCoffeeBonusScreenFromCoffee } from '../../../../features/Coffee/OpenCoffeeBonusScreen'
import { OpenCoffeeScreen } from '../../../../features/Home/OpenCoffeeScreen'
import { OpenFuelScreen } from '../../../../features/Home/OpenFuelScreen'
import { OpenHistoryScreen } from '../../../../features/Home/OpenHistoryScreen'
import { OpenOsagoScreen } from '../../../../features/Home/OpenOsagoScreen'
import { OpenPayBalanceScreen } from '../../../../features/Home/OpenPayBalanceScreen'
import { OpenPromotionAndBonusesScreen } from '../../../../features/Home/OpenPromotionAndBonusesScreen'
import { OpenTransferBalanceScreen } from '../../../../features/Home/OpenTransferBalanceScreen'
import {
    AppStore,
    ESCREENS,
    SIZES,
    UserStore,
    useFetchData,
    useFetchStoreData,
} from '../../../../shared'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { homeMainWidgetApi } from '../api/homeMainWidgetApi'
import { IHomeMainwidgetData } from '../config/interfaces/IHomeMainwidgetData'
import { HomeStore } from '../model/HomeStore'
import { ShowMainPromotions } from '../../../../features/Home/ShowMainPromotions'
import { ShowPromotionsModal } from '../../../../features/ShowPromotionsModal'
import { OpenFuelPricesScreen } from '../../../../features/Home/OpenFuelPricesScreen'

type Props = {}

export const HomeMainWidget = (props: Props) => {
    const data = HomeStore.useData()
    const setBalance = UserStore.useSetBalance()
    const setToken = UserStore.useSetToken()
    const isTokenRefreshed = AppStore.useIsTokenRefreshed()
    const toggleTokenIsRefreshed = AppStore.useToggleIsTokenRefreshed()
    const { errorText, fetchData, isDataLoading } =
        useFetchStoreData<IHomeMainwidgetData>({
            apiCallback: homeMainWidgetApi.getHome,
            setData: HomeStore.useSetData(),
            errorText: 'Ошибка при загрузке данных',
        })
    const { fetchData: refreshToken, errorText: refreshTokenErrorText } =
        useFetchData({
            apiCallback: homeMainWidgetApi.refreshToken,
            errorText: 'Произошла ошибка',
        })

    const texts = HomeStore.useTexts()
    const reloadData = async () => {
        if (!isTokenRefreshed) {
            refreshToken({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    toggleTokenIsRefreshed(true)
                    setToken(data.token)
                    fetchData({
                        args: undefined,
                        hideToastOnError: true,
                        afterDataCallback(data) {
                            setBalance({ balance: data.balance })
                        },
                    })
                },
            })
        } else {
            fetchData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({ balance: data.balance })
                },
            })
        }
    }

    useFocusEffect(
        useCallback(() => {
            reloadData()
        }, [])
    )

    useEffect(() => {
    }, [isTokenRefreshed])

    if (errorText || refreshTokenErrorText) {
        return (
            <ErrorWhileFetchingForm
                buttonProps={{ type: 'primary' }}
                onReload={reloadData}
                message={errorText || refreshTokenErrorText}
            />
        )
    }
    return (
        <>
            <View style={styles.container}>
                {isTokenRefreshed && <ShowPromotionsModal />}
                <View style={styles.row}>
                    <OpenFuelScreen
                        big_text={texts[ESCREENS.FUEL]?.big_text}
                        small_text={texts[ESCREENS.FUEL]?.small_text}
                    />
                </View>
                <View style={styles.row}>
                    {data?.options?.includes(ESCREENS.PAY_BALANCE) && (
                        <OpenPayBalanceScreen />
                    )}
                    {data?.options?.includes(ESCREENS.TRANSFER_BALANCE) && (
                        <OpenTransferBalanceScreen />
                    )}
                </View>

                {data?.coffee_bonus && data.coffee_bonus > 0 && (
                    <OpenCoffeeBonusScreenFromCoffee
                        count={data?.coffee_bonus}
                    />
                )}
                <View style={styles.mainBlocks}>
                    {isDataLoading && !data ? (
                        <>
                            <Skeleton
                                width={SIZES.WIDTH(1 / 2) - 30 * SIZES.PX}
                                height={150 * SIZES.PX}
                            />
                            <Skeleton
                                width={SIZES.WIDTH(1 / 2) - 30 * SIZES.PX}
                                height={150 * SIZES.PX}
                            />
                        </>
                    ) : (
                        <>
                            {data?.options?.includes(ESCREENS.COFFEE) && (
                                <OpenCoffeeScreen
                                    big_text={texts[ESCREENS.COFFEE]?.big_text}
                                    small_text={
                                        texts[ESCREENS.COFFEE]?.small_text
                                    }
                                />
                            )}
                        </>
                    )}

                    {isDataLoading && !data ? (
                        <View style={styles.row}>
                            <Skeleton
                                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                                height={140 * SIZES.PX}
                            />
                        </View>
                    ) : (
                        <>
                            {data?.options?.includes(ESCREENS.FUEL_PRICES) && (
                                <OpenFuelPricesScreen
                                    big_text={
                                        texts[ESCREENS.FUEL_PRICES]?.big_text
                                    }
                                    small_text={
                                        texts[ESCREENS.FUEL_PRICES]?.small_text
                                    }
                                />
                            )}
                        </>
                    )}
                    {isDataLoading && !data ? (
                        <View style={styles.row}>
                            <Skeleton
                                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                                height={140 * SIZES.PX}
                            />
                        </View>
                    ) : (
                        <>
                            {data?.options?.includes(
                                ESCREENS.PROMOTIONS_AND_BONUSES
                            ) && (
                                <OpenPromotionAndBonusesScreen
                                    big_text={
                                        texts[ESCREENS.PROMOTIONS_AND_BONUSES]
                                            ?.big_text
                                    }
                                    small_text={
                                        texts[ESCREENS.PROMOTIONS_AND_BONUSES]
                                            ?.small_text
                                    }
                                />
                            )}
                        </>
                    )}
                    {isDataLoading && !data ? (
                        <View style={styles.row}>
                            <Skeleton
                                width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                                height={140 * SIZES.PX}
                            />
                        </View>
                    ) : (
                        <>
                            {data?.options?.includes(ESCREENS.HISTORY) && (
                                <View style={styles.row}>
                                    <OpenHistoryScreen
                                        big_text={
                                            texts[ESCREENS.HISTORY]?.big_text
                                        }
                                        small_text={
                                            texts[ESCREENS.HISTORY]?.small_text
                                        }
                                    />
                                </View>
                            )}
                        </>
                    )}
                </View>
                <ShowMainPromotions />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 12 * SIZES.PX,
    },
    row: {
        flexDirection: 'row',
        gap: 8 * SIZES.PX,
    },

    mainBlocks: {
        flexDirection: 'row',
        gap: 8 * SIZES.PX,
        flexWrap: 'wrap',
    },
})
