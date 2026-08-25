import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { FuelListRow } from '../../../../entities/Fuel/FuelListRow'
import { StepHeader } from '../../../../entities/StepHeader'
import { IAzs, IColumn, SIZES, SPACING, useFetchData } from '../../../../shared'
import { CenteredState } from '../../../../shared/CenteredState'
import { ISelectOption } from '../../../../shared/CustomSelect'
import { GlassSelect } from '../../../../shared/GlassSelect'
import { MPLayout } from '../../../../shared/MpLayout'
import { PillButton } from '../../../../shared/PillButton'
import { selectAzsAndColumnApi } from '../api/selectAzsAndColumnApi'
import { IGetAzsListData } from '../config/interfaces/IGetAzsListData'
import { IGetColumnsData } from '../config/interfaces/IGetColumnsData'
import { SelectAzsAndColumnSkeleton } from './SelectAzsAndColumnSkeleton'

type Props = {
    /** АЗС, определённая по геолокации: помечаем её в списке */
    azs: IAzs | null

    onSelectAzsAndColumn: ({
        azs,
        column,
    }: {
        azs: IAzs
        column: IColumn
    }) => void
    onGoBack: () => void
}

// Два шага одного слайса: список АЗС → выбор её колонки. Экрана колонок
// в макете нет (см. plans/); колонок на станции бывает много, поэтому
// вместо списка — колесо-пикер, как в старом дизайне.
export const SelectAzsAndColumn = memo(
    ({ azs, onSelectAzsAndColumn, onGoBack }: Props) => {
        const [step, setStep] = useState<'azs' | 'column'>('azs')
        const [selectedAzs, setSelectedAzs] = useState<IAzs | null>(null)
        const [selectedColumn, setSelectedColumn] =
            useState<ISelectOption | null>(null)

        const {
            data: azsListData,
            errorText: azsListErrorText,
            fetchData: fetchAzsListData,
            isDataLoading: isAzsListLoading,
        } = useFetchData<IGetAzsListData>({
            apiCallback: selectAzsAndColumnApi.getAzsList,
            errorText: 'Не удалось получить список заправок',
        })

        const {
            data: columnsData,
            errorText: columnsErrorText,
            fetchData: fetchColumnsData,
            isDataLoading: isColumnsDataLoading,
        } = useFetchData<IGetColumnsData, { azs_id: string }>({
            apiCallback: selectAzsAndColumnApi.getColumns,
            errorText: 'Не удалось получить список колонок',
            defaultLoading: false,
        })

        const handleReloadAzsList = useCallback(() => {
            fetchAzsListData({ args: undefined, hideToastOnError: true })
        }, [fetchAzsListData])

        const handleSelectAzs = useCallback(
            (azsId: string) => {
                const selected = azsListData?.azs_list.find(
                    (item) => item.id === azsId
                )
                if (!selected) {
                    return
                }
                setSelectedAzs(selected)
                setSelectedColumn(null)
                setStep('column')
                fetchColumnsData({
                    args: { azs_id: selected.id },
                    hideToastOnError: true,
                })
            },
            [azsListData, fetchColumnsData]
        )

        const handleReloadColumns = useCallback(() => {
            if (selectedAzs) {
                fetchColumnsData({
                    args: { azs_id: selectedAzs.id },
                    hideToastOnError: true,
                })
            }
        }, [selectedAzs, fetchColumnsData])

        const columnOptions: ISelectOption[] = useMemo(
            () =>
                (columnsData?.trcs ?? []).map((trc) => ({
                    label: `Колонка № ${trc.id}`,
                    value: trc.id,
                })),
            [columnsData]
        )

        const handleSubmitColumn = useCallback(() => {
            const column = columnsData?.trcs.find(
                (trc) => trc.id === selectedColumn?.value
            )
            if (selectedAzs && column) {
                onSelectAzsAndColumn({ azs: selectedAzs, column })
            }
        }, [selectedAzs, selectedColumn, columnsData, onSelectAzsAndColumn])

        const handleBack = useCallback(() => {
            if (step === 'column') {
                setStep('azs')
                return
            }
            onGoBack()
        }, [step, onGoBack])

        useEffect(() => {
            handleReloadAzsList()
        }, [])

        const styles = StyleSheet.create({
            list: {
                gap: SPACING.ROW_GAP * SIZES.PX,
            },
        })

        const isColumnStep = step === 'column'
        const errorText = isColumnStep ? columnsErrorText : azsListErrorText
        const isLoading = isColumnStep ? isColumnsDataLoading : isAzsListLoading
        const azsList = azsListData?.azs_list
        const itemsCount = isColumnStep
            ? columnsData?.trcs.length
            : azsList?.length

        return (
            <>
                <StepHeader
                    title={isColumnStep ? 'Выбор колонки' : 'Выбор АЗС'}
                    onBack={handleBack}
                />

                {errorText ? (
                    <ErrorWhileFetchingForm
                        onReload={
                            isColumnStep
                                ? handleReloadColumns
                                : handleReloadAzsList
                        }
                        message={errorText}
                    />
                ) : isLoading ? (
                    // На шаге колонки грузится одно поле, а не список.
                    <SelectAzsAndColumnSkeleton
                        rows={isColumnStep ? 1 : undefined}
                    />
                ) : !itemsCount ? (
                    <CenteredState
                        variant="empty"
                        title={
                            isColumnStep
                                ? 'Колонок не нашлось'
                                : 'Заправок не нашлось'
                        }
                        description="Попробуйте обновить список позже."
                        action={{
                            label: 'Обновить',
                            onPress: isColumnStep
                                ? handleReloadColumns
                                : handleReloadAzsList,
                        }}
                    />
                ) : isColumnStep ? (
                    // Колонок на АЗС бывает много — списком они занимают
                    // весь экран, поэтому здесь колесо-пикер.
                    <>
                        <GlassSelect
                            placeholder="Выберите колонку"
                            options={columnOptions}
                            selectedOption={selectedColumn}
                            onChangeOption={setSelectedColumn}
                        />
                        <MPLayout mt={SPACING.ROW_GAP}>
                            <PillButton
                                title="Перейти далее"
                                onPress={handleSubmitColumn}
                                disabled={!selectedColumn}
                            />
                        </MPLayout>
                    </>
                ) : (
                    <View style={styles.list}>
                        {azsList?.map((item) => (
                            <FuelListRow
                                key={item.id}
                                id={item.id}
                                title={item.name}
                                // IAzs пока не несёт адрес/геолокацию (сервер их
                                // отдаёт, но UI ими не пользуется); подсветка "рядом
                                // с вами" не сработает, пока не вернётся автоподбор
                                // по геолокации (см. FuelSelectAzsAndColumnWidget).
                                value={
                                    azs?.id === item.id
                                        ? 'Рядом с вами'
                                        : undefined
                                }
                                onSelect={handleSelectAzs}
                            />
                        ))}
                    </View>
                )}
            </>
        )
    }
)
