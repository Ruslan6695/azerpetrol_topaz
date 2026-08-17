import { useFocusEffect } from 'expo-router'
import React, { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { BalanceCard } from '../../../../entities/Home/BalanceCard'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { OpenCoffeeBonusScreenFromCoffee } from '../../../../features/Coffee/OpenCoffeeBonusScreen'
import { ConvertBonusToBalance } from '../../../../features/Home/ConvertBonusToBalance'
import { OpenCoffeeScreen } from '../../../../features/Home/OpenCoffeeScreen'
import { OpenFuelPricesScreen } from '../../../../features/Home/OpenFuelPricesScreen'
import { OpenFuelScreen } from '../../../../features/Home/OpenFuelScreen'
import { OpenHistoryScreen } from '../../../../features/Home/OpenHistoryScreen'
import { OpenPayBalanceScreen } from '../../../../features/Home/OpenPayBalanceScreen'
import { OpenPromotionAndBonusesScreen } from '../../../../features/Home/OpenPromotionAndBonusesScreen'
import { OpenTransferBalanceScreen } from '../../../../features/Home/OpenTransferBalanceScreen'
import { ToggleBalanceVisibility } from '../../../../features/Home/ToggleBalanceVisibility'
import { ShowMainPromotions } from '../../../../features/Home/ShowMainPromotions'
import { ShowPromotionsModal } from '../../../../features/ShowPromotionsModal'
import {
    AppStore,
    ESCREENS,
    SIZES,
    SPACING,
    UserStore,
    useFetchData,
    useFetchStoreData,
} from '../../../../shared'
import { ContentIn } from '../../../../shared/ContentIn'
import { homeMainWidgetApi } from '../api/homeMainWidgetApi'
import { IHomeMainwidgetData } from '../config/interfaces/IHomeMainwidgetData'
import { HomeStore } from '../model/HomeStore'
import { HomeMainWidgetSkeleton } from './HomeMainWidgetSkeleton'

type Props = {}

export const HomeMainWidget = memo((props: Props) => {
    const data = HomeStore.useData()
    const balance = UserStore.useBalance()
    const bonusBalance = UserStore.useBonus_balance()
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
                            setBalance({
                                balance: data.balance,
                                bonus_balance: data.bonus_balance,
                            })
                        },
                    })
                },
            })
        } else {
            fetchData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({
                        balance: data.balance,
                        bonus_balance: data.bonus_balance,
                    })
                },
            })
        }
    }

    useFocusEffect(
        useCallback(() => {
            reloadData()
        }, [])
    )

    const styles = StyleSheet.create({
        container: {
            gap: SPACING.MD * SIZES.PX,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: SPACING.MD * SIZES.PX,
        },
    })

    if (errorText || refreshTokenErrorText) {
        return (
            <ErrorWhileFetchingForm
                onReload={reloadData}
                message={errorText ?? refreshTokenErrorText ?? ''}
            />
        )
    }

    if (isDataLoading && !data) {
        return <HomeMainWidgetSkeleton />
    }

    const canPay = data?.options?.includes(ESCREENS.PAY_BALANCE)
    const canTransfer = data?.options?.includes(ESCREENS.TRANSFER_BALANCE)
    // Именно undefined, а не пустой фрагмент: массив [false, false] был бы
    // truthy и дал бы в карточке пустой ряд с отступом.
    const balanceActions =
        canPay || canTransfer ? (
            <>
                {canPay && <OpenPayBalanceScreen />}
                {canTransfer && <OpenTransferBalanceScreen />}
            </>
        ) : undefined

    return (
        <ContentIn style={styles.container}>
            {isTokenRefreshed && <ShowPromotionsModal />}

            <BalanceCard
                balance={balance ?? 0}
                bonus_balance={bonusBalance ?? 0}
                actions={balanceActions}
                bonusAction={<ConvertBonusToBalance />}
                visibilityAction={<ToggleBalanceVisibility />}
            />

            <OpenFuelScreen
                big_text={texts[ESCREENS.FUEL]?.big_text}
                small_text={texts[ESCREENS.FUEL]?.small_text}
            />

            <View style={styles.grid}>
                {data?.options?.includes(ESCREENS.COFFEE) && (
                    <OpenCoffeeScreen
                        big_text={texts[ESCREENS.COFFEE]?.big_text}
                        small_text={texts[ESCREENS.COFFEE]?.small_text}
                    />
                )}
                {data?.options?.includes(ESCREENS.HISTORY) && (
                    <OpenHistoryScreen
                        big_text={texts[ESCREENS.HISTORY]?.big_text}
                        small_text={texts[ESCREENS.HISTORY]?.small_text}
                    />
                )}
                {data?.options?.includes(ESCREENS.PROMOTIONS_AND_BONUSES) && (
                    <OpenPromotionAndBonusesScreen
                        big_text={
                            texts[ESCREENS.PROMOTIONS_AND_BONUSES]?.big_text
                        }
                        small_text={
                            texts[ESCREENS.PROMOTIONS_AND_BONUSES]?.small_text
                        }
                    />
                )}
                {data?.options?.includes(ESCREENS.FUEL_PRICES) && (
                    <OpenFuelPricesScreen
                        big_text={texts[ESCREENS.FUEL_PRICES]?.big_text}
                        small_text={texts[ESCREENS.FUEL_PRICES]?.small_text}
                    />
                )}
            </View>

            {!!data?.coffee_bonus && data.coffee_bonus > 0 && (
                <OpenCoffeeBonusScreenFromCoffee count={data.coffee_bonus} />
            )}

            <ShowMainPromotions />
        </ContentIn>
    )
})
