import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { ScreenTitle } from '../../../../entities/ScreenTitle'
import { StepHeader } from '../../../../entities/StepHeader'
import {
    FuelStore,
    IAzs,
    IColumn,
    ITrkType,
    SIZES,
    SPACING,
    UserStore,
    useFetchData,
} from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { selectTrkTypeApi } from '../api/selectTrkTypeApi'
import { ISelectTrkTypeData } from '../config/interfaces/ISelectTrkTypeData'
import { SelectTrkTypeFormSkeleton } from './SelectTrkTypeFormSkeleton'
import { TrkTypeRow } from './TrkTypeRow'

type Props = {
    column: IColumn
    azs: IAzs
    onSelectTrkType: (trkType: ITrkType) => void
    onGoBack: () => void
}

export const SelectTrkTypeForm = memo(
    ({ azs, column, onSelectTrkType, onGoBack }: Props) => {
        const setBalance = UserStore.useSetBalance()
        const changeFuelOnDebt = FuelStore.useChangeFuelOnDebt()

        const { data, errorText, fetchData, isDataLoading } = useFetchData<
            ISelectTrkTypeData,
            { azsId: number; columnId: number }
        >({
            apiCallback: selectTrkTypeApi.getTrkTypes,
            errorText: 'Не удалось получить типы топлива',
        })

        const handleReloadData = useCallback(() => {
            fetchData({
                args: { azsId: azs.id, columnId: column.id },
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({
                        balance: data.balance,
                        bonus_balance: data.bonus_balance,
                    })
                    changeFuelOnDebt(data.fuel_on_debt)
                },
            })
        }, [azs, column, fetchData, setBalance, changeFuelOnDebt])

        useEffect(() => {
            handleReloadData()
        }, [])

        const styles = StyleSheet.create({
            list: {
                gap: SPACING.ROW_GAP * SIZES.PX,
            },
        })

        return (
            <>
                <StepHeader title="Выбор топлива" onBack={onGoBack} />
                <ScreenTitle
                    title="Выберите топливо"
                    type="h6"
                    ml={SPACING.XS}
                />

                {errorText ? (
                    <ErrorWhileFetchingForm
                        onReload={handleReloadData}
                        message={errorText}
                    />
                ) : isDataLoading ? (
                    <SelectTrkTypeFormSkeleton />
                ) : !data?.trc_types?.length ? (
                    <CenteredState
                        variant="empty"
                        title="Топливо не загрузилось"
                        description="Попробуйте обновить экран позже."
                        action={{
                            label: 'Обновить',
                            onPress: handleReloadData,
                        }}
                    />
                ) : (
                    <View style={styles.list}>
                        {data.trc_types.map((trk) => (
                            <TrkTypeRow
                                key={trk.id}
                                trkType={trk}
                                onSelect={onSelectTrkType}
                            />
                        ))}
                    </View>
                )}
            </>
        )
    }
)
