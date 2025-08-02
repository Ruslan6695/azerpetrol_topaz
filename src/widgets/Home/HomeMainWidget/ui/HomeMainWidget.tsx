import { useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { OpenCoffeeScreen } from '../../../../features/Home/OpenCoffeeScreen'
import { OpenFuelScreen } from '../../../../features/Home/OpenFuelScreen'
import { OpenHistoryScreen } from '../../../../features/Home/OpenHistoryScreen'
import { OpenOsagoScreen } from '../../../../features/Home/OpenOsagoScreen'
import { OpenPayBalanceScreen } from '../../../../features/Home/OpenPayBalanceScreen'
import { OpenProductsScreen } from '../../../../features/Home/OpenProductsScreen'
import { OpenPromotionAndBonusesScreen } from '../../../../features/Home/OpenPromotionAndBonusesScreen'
import { OpenTransferBalanceScreen } from '../../../../features/Home/OpenTransferBalanceScreen'
import {
    ESCREENS,
    SIZES,
    UserStore,
    useFetchStoreData,
} from '../../../../shared'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'
import { homeMainWidgetApi } from '../api/homeMainWidgetApi'
import { IHomeMainwidgetData } from '../config/interfaces/IHomeMainwidgetData'
import { HomeStore } from '../model/HomeStore'
import { OpenCoffeeBonusScreenFromCoffee } from '../../../../features/Coffee/OpenCoffeeBonusScreen'
import { ShowMainPromotions } from '../../../../features/Home/ShowMainPromotions'

type Props = {}

export const HomeMainWidget = (props: Props) => {
    const data = HomeStore.useData()
    const setBalance = UserStore.useSetBalance()
    const { errorText, fetchData, isDataLoading } =
        useFetchStoreData<IHomeMainwidgetData>({
            apiCallback: homeMainWidgetApi.getHome,
            setData: HomeStore.useSetData(),
            errorText: 'Ошибка при загрузке данных',
        })

    const texts = HomeStore.useTexts()
    const reloadData = () => {
        fetchData({
            args: undefined,
            hideToastOnError: true,
            afterDataCallback(data) {
                setBalance({ balance: data.balance })
            },
        })
    }

    useFocusEffect(
        useCallback(() => {
            reloadData()
        }, [])
    )

    if (errorText) {
        return (
            <ErrorWhileFetchingForm onReload={reloadData} message={errorText} />
        )
    }
    return (
        <>
            <View style={styles.container}>
                <View style={styles.row}>
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
                            <OpenFuelScreen
                                big_text={texts[ESCREENS.FUEL]?.big_text}
                                small_text={texts[ESCREENS.FUEL]?.small_text}
                            />
                            <View style={styles.fuelBlockRight}>
                                <OpenPayBalanceScreen />
                                {data?.options?.includes(
                                    ESCREENS.TRANSFER_BALANCE
                                ) && <OpenTransferBalanceScreen />}
                            </View>
                        </>
                    )}
                </View>
                {data?.coffee_bonus && data.coffee_bonus > 0 && (
                    <OpenCoffeeBonusScreenFromCoffee
                        count={data?.coffee_bonus}
                    />
                )}
                <View style={styles.row}>
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
                            {data?.options?.includes(ESCREENS.PRODUCTS) && (
                                <OpenProductsScreen
                                    big_text={
                                        texts[ESCREENS.PRODUCTS]?.big_text
                                    }
                                    small_text={
                                        texts[ESCREENS.PRODUCTS]?.small_text
                                    }
                                />
                            )}
                        </>
                    )}
                </View>
                <ShowMainPromotions />

                {isDataLoading && !data ? (
                    <View style={styles.row}>
                        <Skeleton
                            width={SIZES.WIDTH(1) - 40 * SIZES.PX}
                            height={140 * SIZES.PX}
                        />
                    </View>
                ) : (
                    <>
                        {data?.options?.includes(ESCREENS.OSAGO) && (
                            <View style={styles.row}>
                                <OpenOsagoScreen
                                    big_text={texts[ESCREENS.OSAGO]?.big_text}
                                    small_text={
                                        texts[ESCREENS.OSAGO]?.small_text
                                    }
                                />
                            </View>
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
                            <View style={styles.row}>
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
                            </View>
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
                                    big_text={texts[ESCREENS.HISTORY]?.big_text}
                                    small_text={
                                        texts[ESCREENS.HISTORY]?.small_text
                                    }
                                />
                            </View>
                        )}
                    </>
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 15 * SIZES.PX,
    },
    row: {
        flexDirection: 'row',
        gap: 15 * SIZES.PX,
    },
    fuelBlockRight: {
        justifyContent: 'space-between',
        rowGap: 10 * SIZES.PX,
        flex: 1.1,
    },
})
