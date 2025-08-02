import { memo, useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { IAzs, IColumn, SIZES, useFetchData } from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import {
    CustomSelect,
    ISelectOption,
    useSelect,
} from '../../../../shared/CustomSelect'
import { FuelIcon } from '../../../../shared/Icons/FuelIcon'
import { LocationIcon } from '../../../../shared/LocationIcon'
import { showError } from '../../../../shared/ToastComponent'
import { selectAzsAndColumnApi } from '../api/selectAzsAndColumnApi'
import { IGetColumnsData } from '../config/interfaces/IGetColumnsData'
import { SelectAzsAndColumnSkeleton } from './SelectAzsAndColumnSkeleton'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import Skeleton from '../../../../shared/Skeleton/ui/Skeletons'

type Props = {
    azs: IAzs | null
    column: IColumn | null

    onSelectAzsAndColumn: ({
        azs,
        column,
    }: {
        azs: IAzs
        column: IColumn
    }) => void
    onGoBack: () => void
}

export const SelectAzsAndColumn = memo(
    ({ azs, onSelectAzsAndColumn, column, onGoBack }: Props) => {
        const {
            errorText: azsListErrorText,
            fetchData: fetchAzsListData,
            isDataLoading: isAzsListLoading,
        } = useFetchData({
            apiCallback: selectAzsAndColumnApi.getAzsList,
            errorText: 'Не удалось получить список заправок',
        })

        const {
            data: columnsData,
            errorText: columnsErrorText,
            fetchData: fetchColumnsData,
            isDataLoading: isColumnsDataLoading,
        } = useFetchData<IGetColumnsData, { azs_id: number }>({
            apiCallback: selectAzsAndColumnApi.getColumns,
            errorText: 'Не удалось получить список колонок',
            defaultLoading: false,
        })

        const {
            handleChangeSelectOption: handleChangeAzs,
            selectedOption: selectedAzs,
            setOptions: setAzsOptions,
            options: azsOptions,
        } = useSelect({
            onChangeOption(option) {
                if (option) {
                    handleChangeColumn(null)
                    fetchColumnsData({
                        args: { azs_id: option.value },
                        afterDataCallback(data) {
                            const options: ISelectOption[] = data.trcs.map(
                                (opt) => ({
                                    label: `№ ${opt.name}`,
                                    value: opt.id,
                                })
                            )
                            setColumnOptions(options)
                        },
                    })
                }
            },
        })

        const {
            handleChangeSelectOption: handleChangeColumn,
            selectedOption: selectedColumn,
            options: columnOptions,
            setOptions: setColumnOptions,
        } = useSelect()

        const handleSubmit = useCallback(() => {
            if (selectedAzs && selectedColumn) {
                const findedColumn = columnsData?.trcs.find(
                    (trk) => trk.id === selectedColumn.value
                )
                if (findedColumn) {
                    onSelectAzsAndColumn({
                        azs: { id: selectedAzs.value, name: selectedAzs.label },
                        column: {
                            id: selectedColumn.value,
                            name: selectedColumn.label,
                            device: findedColumn.device,
                        },
                    })
                }
            } else {
                showError({ text: 'Сначала выберите Азс и номер колонки' })
            }
        }, [selectedAzs, selectedColumn, onSelectAzsAndColumn, columnsData])

        const handleReloadAzsAndColumn = useCallback(() => {
            fetchAzsListData({
                args: undefined,
                hideToastOnError: true,
                afterDataCallback(data) {
                    let options: ISelectOption[] = data.azs_list.map((opt) => ({
                        label: opt.name,
                        value: opt.id,
                    }))
                    setAzsOptions(options)
                },
            })
        }, [])

        useEffect(() => {
            if (azs) {
                handleChangeAzs({ label: azs.name, value: azs.id })
            }
            if (column) {
                handleChangeColumn({ label: column.name, value: column.id })
            }
        }, [column, azs])

        useEffect(() => {
            handleReloadAzsAndColumn()
        }, [])

        if (azsListErrorText) {
            return (
                <ErrorWhileFetchingForm
                    onReload={handleReloadAzsAndColumn}
                    message={azsListErrorText}
                />
            )
        }

        return (
            <View>
                {isAzsListLoading ? (
                    <>
                        <SelectAzsAndColumnSkeleton />

                        <CustomButton
                            onPress={onGoBack}
                            styled={{
                                marginsPaddings: { mt: 10 },

                                type: 'OUTLINED',
                                width: { type: 'absolute', value: '100%' },
                            }}
                        >
                            ВЕРНУТЬСЯ НАЗАД
                        </CustomButton>
                    </>
                ) : (
                    <>
                        <CustomSelect
                            styled={{
                                width: { type: 'absolute', value: '100%' },
                            }}
                            icon={<LocationIcon />}
                            onChangeOption={handleChangeAzs}
                            selectedOption={selectedAzs}
                            options={azsOptions ? azsOptions : []}
                            placeholder="Выберите Азс"
                            title="ВЫБОР АЗС"
                        />
                        {isColumnsDataLoading ? (
                            <Skeleton
                                margins={{ mt: 20, mb: 30 }}
                                width={SIZES.WIDTH(1) - SIZES.PX * 40}
                                height={56}
                            />
                        ) : (
                            <CustomSelect
                                disabledProps={{
                                    disabled: !selectedAzs || !columnOptions,
                                    disabledText: 'Сначала выберите Азс',
                                }}
                                styled={{
                                    marginsPaddings: { mt: 20, mb: 30 },
                                    width: { type: 'absolute', value: '100%' },
                                }}
                                icon={<FuelIcon />}
                                onChangeOption={handleChangeColumn}
                                selectedOption={selectedColumn}
                                options={columnOptions ? columnOptions : []}
                                placeholder="Выберите колонку"
                                title="ВЫБОР КОЛОНКИ"
                            />
                        )}

                        <CustomButton
                            onPress={handleSubmit}
                            styled={{
                                width: { type: 'absolute', value: '100%' },
                            }}
                        >
                            ПЕРЕЙТИ ДАЛЕЕ
                        </CustomButton>
                        <CustomButton
                            onPress={onGoBack}
                            styled={{
                                marginsPaddings: { mt: 10 },
                                type: 'OUTLINED',
                                width: { type: 'absolute', value: '100%' },
                            }}
                        >
                            ВЕРНУТЬСЯ НАЗАД
                        </CustomButton>
                    </>
                )}
            </View>
        )
    }
)
