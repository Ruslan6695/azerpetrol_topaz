import { memo, useCallback, useState } from 'react'
import { ESCREENS, useFetchData, useModal } from '../../../../shared'
import { coffeeBonusWidgetApi } from '../api/coffeeBonusWidgetApi'
import { CustomText } from '../../../../shared/CustomText'
import { MapCoffeeItems } from '../../../../features/Coffee/MapCoffeeItems'
import { BuySelectCoffeeModal } from '../../../../features/Coffee/BuySelectCoffeeModal'
import { useFocusEffect, useRouter } from 'expo-router'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { ICoffeeItem } from '../../../../entities/Coffee/CoffeeItem'

type Props = {
    selectedCoffeeMachineId: number
}

export const CoffeeBonusWidget = memo(({ selectedCoffeeMachineId }: Props) => {
    const router = useRouter()
    const { data, errorText, fetchData, isDataLoading } = useFetchData({
        apiCallback: coffeeBonusWidgetApi.getCoffee,
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
        })
    }, [])

    const handleSelectCoffee = useCallback(() => {
        router.navigate({ pathname: ESCREENS.COFFEE, params: { road: 'muy' } })
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
            <CustomText marginsPaddings={{ mb: 15 }} fz={20} fw="500">
                ВЫБЕРИТЕ НАПИТОК
            </CustomText>

            <MapCoffeeItems
                bonus={true}
                onBuyCoffee={handleOpenBuyCoffeeModal}
                isItemsLoading={isDataLoading}
                items={data?.coffee}
            />

            <BuySelectCoffeeModal
                coffeeMachineId={selectedCoffeeMachineId}
                //@ts-ignore
                coffee={coffeeToBuy}
                onSubmit={handleSelectCoffee}
                type="bonus"
                handleClose={handleCloseModal}
                isOpened={isShowModal}
            />
        </>
    )
})
