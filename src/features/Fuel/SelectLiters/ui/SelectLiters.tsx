import { useRouter } from 'expo-router'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { FuelLitersSelector } from '../../../../entities/Fuel/FuelLitersSelector'
import { FuelSelectedAzsInfoBlock } from '../../../../entities/Fuel/FuelSelectedAzsInfoBlock'
import { SplitedInfoBlock } from '../../../../entities/SplitedInfoBlock'
import {
    ESCREENS,
    IAzs,
    IColumn,
    ITrkType,
    UserStore,
} from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { useInput } from '../../../../shared/CustomInput'
import { MPLayout } from '../../../../shared/MpLayout'
import { showError } from '../../../../shared/ToastComponent'
import { SelectLitersForm } from './SelectLitersForm'

type Props = {
    column: IColumn
    azs: IAzs
    trkType: ITrkType
    onSubmit: (props: { liters: number; rubles: number }) => void
    onGoBack: () => void
}

export const SelectLiters = memo(
    ({ azs, column, trkType, onSubmit, onGoBack }: Props) => {
        const balance = UserStore.useBalance()
        const router = useRouter()
        const {
            handleChangeInputValue: handleChangeLitersValue,
            inputValue: litersValue,
            setInputValue: setLitersValue,
        } = useInput({
            onChangeValue(value) {
                setRublesValue((+value * trkType.price).toFixed(2))
            },
        })

        const {
            handleChangeInputValue: handleChangeRublesValue,
            inputValue: rublesValue,
            setInputValue: setRublesValue,
        } = useInput({
            onChangeValue(value) {
                setLitersValue((+value / trkType.price).toFixed(2))
            },
        })

        const handleSubmit = useCallback(() => {
            let rubles = +rublesValue
            let liters = +litersValue
            if (liters >= 1) {
                if (rubles <= balance) {
                    onSubmit({
                        rubles: +rublesValue,
                        liters: +litersValue,
                    })
                } else {
                    showError({ text: 'Недостаточно средств' })
                    router.navigate({
                        pathname: ESCREENS.PAY_BALANCE,
                        params: {
                            sum: Math.ceil(rubles - balance),
                            backLink: ESCREENS.FUEL,
                        },
                    })
                }
            } else {
                showError({ text: 'Минимальная сумма для налива - 1 л.' })
            }
        }, [onSubmit, rublesValue, litersValue, balance])

        return (
            <>
                <FuelSelectedAzsInfoBlock azsName={azs.name} />
                <SplitedInfoBlock
                    type="purple"
                    leftText="колонка"
                    rightText={column.name}
                />

                <MPLayout mb={10} mt={10}>
                    <SplitedInfoBlock
                        type="gray"
                        leftText="тип топлива"
                        rightText={trkType.name}
                    />
                </MPLayout>
                <View style={styles.row}>
                    <FuelLitersSelector
                        litersValue={litersValue}
                        onChangeLitersValue={handleChangeLitersValue}
                    />
                    <SelectLitersForm
                        rublesValue={rublesValue}
                        onChangeRublesValue={handleChangeRublesValue}
                        litersValue={litersValue}
                        onChangeLitersValue={handleChangeLitersValue}
                    />
                </View>
                <CustomButton
                    onPress={handleSubmit}
                    styled={{
                        type: 'SUCCES',
                        width: { type: 'absolute', value: '100%' },
                        marginsPaddings: { mb: 10 },
                    }}
                >
                    НАЧАТЬ НАЛИВ ТОПЛИВА
                </CustomButton>
                <CustomButton
                    onPress={onGoBack}
                    styled={{
                        type: 'OUTLINED',
                        width: { type: 'absolute', value: '100%' },
                    }}
                >
                    ВЕРНУТЬСЯ НАЗАД
                </CustomButton>
            </>
        )
    }
)

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
