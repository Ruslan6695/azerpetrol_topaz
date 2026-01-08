import { useFocusEffect } from 'expo-router'
import { memo, useCallback, useState } from 'react'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { BuySelectCoffeeModal } from '../../../../features/Coffee/BuySelectCoffeeModal'
import { MapCoffeeItems } from '../../../../features/Coffee/MapCoffeeItems'
import { OpenCoffeeBonusScreenFromCoffee } from '../../../../features/Coffee/OpenCoffeeBonusScreen'
import { UserStore, useFetchData, useModal } from '../../../../shared'
import { MPLayout } from '../../../../shared/MpLayout'
import { buyCoffeeWidgetApi } from '../api/buyCoffeeWidgetApi'

type Props = {
    onBuyCoffee: () => void
    selectedCoffeeMachineId: number
}

export const BuyCoffeeWidget = memo(
    ({ onBuyCoffee, selectedCoffeeMachineId }: Props) => {
        const setBalance = UserStore.useSetBalance()
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
                        <OpenCoffeeBonusScreenFromCoffee count={data.bonus} />
                    </MPLayout>
                )}
                <ScreenTitle title="Выберите напиток" />

                <MapCoffeeItems
                    onBuyCoffee={handleOpenBuyCoffeeModal}
                    isItemsLoading={isDataLoading}
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
