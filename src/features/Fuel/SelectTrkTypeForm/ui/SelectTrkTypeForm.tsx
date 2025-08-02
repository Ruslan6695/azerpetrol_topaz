import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { ErrorWhileFetchingForm } from '../../../../entities/ErrorWhileFetchingForm'
import { FuelSelectedAzsInfoBlock } from '../../../../entities/Fuel/FuelSelectedAzsInfoBlock'
import { TrkTypeBlock } from '../../../../entities/Fuel/TrkTypeBlock'
import { SplitedInfoBlock } from '../../../../entities/SplitedInfoBlock'
import {
    COLORS,
    IAzs,
    IColumn,
    ITrkType,
    SIZES,
    UserStore,
    useFetchData,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomText } from '../../../../shared/CustomText'
import { selectTrkTypeApi } from '../api/selectTrkTypeApi'
import { SelectTrkTypeFormSkeleton } from './SelectTrkTypeFormSkeleton'

type Props = {
    column: IColumn
    azs: IAzs
    onSelectTrkType: (trkType: ITrkType) => void
    selectedTrkType: ITrkType | null
    onGoBack: () => void
}

export const SelectTrkTypeForm = memo(
    ({ azs, column, onSelectTrkType, selectedTrkType, onGoBack }: Props) => {
        const setBalance = UserStore.useSetBalance()
        const { data, errorText, fetchData, isDataLoading } = useFetchData({
            apiCallback: selectTrkTypeApi.getTrkTypes,
            errorText: 'Не удалось получить типы топлива',
        })

        const handleReloadData = useCallback(() => {
            fetchData({
                args: { azsId: azs.id, columnId: column.id },
                hideToastOnError: true,
                afterDataCallback(data) {
                    setBalance({ balance: data.balance })
                },
            })
        }, [azs, column])

        useEffect(() => {
            handleReloadData()
        }, [])

        return (
            <>
                <FuelSelectedAzsInfoBlock azsName={azs.name} />
                <SplitedInfoBlock
                    rightFz={25}
                    leftText="Выбрана колонка"
                    type="purple"
                    rightText={column.name}
                />

                <View style={styles.selectTrkTypeBlock}>
                    <CustomText textAlign="center" fz={20} fw="600">
                        ВЫБЕРИТЕ ТИП ТОПЛИВА
                    </CustomText>
                    {errorText ? (
                        <ErrorWhileFetchingForm
                            buttonProps={{
                                width: { type: 'absolute', value: '100%' },
                            }}
                            onReload={handleReloadData}
                            margins={{ mt: -30 }}
                            message={errorText}
                        />
                    ) : isDataLoading ? (
                        <SelectTrkTypeFormSkeleton />
                    ) : (
                        data?.trc_types?.map((trk) => (
                            <TrkTypeBlock
                                isSelected={trk.id === selectedTrkType?.id}
                                onPress={onSelectTrkType}
                                key={trk.id}
                                {...trk}
                            />
                        ))
                    )}
                </View>
                <View style={styles.buttonsContainer}>
                    <CustomButton
                        onPress={onGoBack}
                        styled={{
                            type: 'OUTLINED',
                        }}
                    >
                        ВЕРНУТЬСЯ НАЗАД
                    </CustomButton>
                </View>
            </>
        )
    }
)

const styles = StyleSheet.create({
    azsContainer: {
        backgroundColor: COLORS.GRAY_3,
        width: '100%',
        padding: 10 * SIZES.PX,
        marginBottom: SIZES.PX * 10,
        borderRadius: SIZES.PX * 15,
    },
    selectTrkTypeBlock: {
        backgroundColor: COLORS.GRAY_3,
        padding: SIZES.PX * 10,
        marginTop: SIZES.PX * 10,
        borderRadius: SIZES.PX * 15,
        gap: 10 * SIZES.PX,
    },
    buttonsContainer: {
        padding: SIZES.PX * 10,
    },
})
