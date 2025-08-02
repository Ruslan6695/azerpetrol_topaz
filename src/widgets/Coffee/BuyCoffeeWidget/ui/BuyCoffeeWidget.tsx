import { memo, useCallback, useState } from 'react'
import { View } from 'react-native'
import { CustomText } from '../../../../shared/CustomText'
import { MapCoffeeItems } from '../../../../features/Coffee/MapCoffeeItems'
import { UserStore, useFetchData, useModal } from '../../../../shared'
import { buyCoffeeWidgetApi } from '../api/buyCoffeeWidgetApi'
import { useFocusEffect } from 'expo-router'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { BuySelectCoffeeModal } from '../../../../features/Coffee/BuySelectCoffeeModal'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { OpenCoffeeBonusScreenFromCoffee } from '../../../../features/Coffee/OpenCoffeeBonusScreen'
import { MPLayout } from '../../../../shared/MpLayout'
import { CoffeeMachinesStore } from '../../../../features/Coffee/SelectCoffeeMachine'

type Props = {
    onBuyCoffee: () => void
    selectedCoffeeMachineId: number
}

export const BuyCoffeeWidget = memo(
    ({ onBuyCoffee, selectedCoffeeMachineId }: Props) => {
        const setBalance = UserStore.useSetBalance()
        const isCoffeeMachinesLoading = CoffeeMachinesStore.useIsLoading()
        const { data, errorText, fetchData, isDataLoading } = useFetchData({
            apiCallback: buyCoffeeWidgetApi.getCoffee,
            errorText: 'Произошла ошибка при загрузке кофе',
        })
        const [coffeeToBuy, setCoffeeToBuy] = useState<ICoffeeItem>()
        const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

        const handleOpenBuyCoffeeModal = useCallback((coffee: ICoffeeItem) => {
            setCoffeeToBuy(coffee)
            handleOpenModal()
        }, [])

        const handleReloadData = useCallback(() => {
            fetchData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({ balance: data.balance })
                },
            })
        }, [])

        useFocusEffect(
            useCallback(() => {
                handleReloadData()
            }, [])
        )
        if (errorText) {
            return (
                <ErrorWhileFetchingForm
                    margins={{ mt: 100 }}
                    message={errorText}
                    onReload={handleReloadData}
                />
            )
        }
        return (
            <>
                {data?.bonus && data.bonus > 0 && (
                    <MPLayout mb={10}>
                        <OpenCoffeeBonusScreenFromCoffee
                            coffeeMachineId={selectedCoffeeMachineId}
                            count={data.bonus}
                        />
                    </MPLayout>
                )}
                <CustomText marginsPaddings={{ mb: 15 }} fz={20} fw="500">
                    ВЫБЕРИТЕ НАПИТОК
                </CustomText>

                <MapCoffeeItems
                    onBuyCoffee={handleOpenBuyCoffeeModal}
                    isItemsLoading={isDataLoading || isCoffeeMachinesLoading}
                    items={data?.coffee}
                />

                <BuySelectCoffeeModal
                    coffeeMachineId={selectedCoffeeMachineId}
                    onSubmit={onBuyCoffee}
                    //@ts-ignore
                    coffee={coffeeToBuy}
                    type="buy"
                    handleClose={handleCloseModal}
                    isOpened={isShowModal}
                />
            </>
        )
    }
)
