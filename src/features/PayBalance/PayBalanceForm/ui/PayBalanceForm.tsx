import { memo, useCallback } from 'react'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { SumIcon } from '../../../../shared/SumIcon'
import { CustomButton } from '../../../../shared/CustomButton'
import { SIZES, useSendFetch } from '../../../../shared'
import { payBalanceFormApi } from '../api/payBalanceFormApi'
import { IPayBalanceFormData } from '../config/interfaces/IPayBalanceFormData'
import { Loader } from '../../../../shared/Loader'
import { showError } from '../../../../shared/ToastComponent'

type Props = {
    onPay: (order: IPayBalanceFormData) => void
    sum: string | null
}

export const PayBalanceForm = memo(({ onPay, sum }: Props) => {
    const { handleChangeInputValue, inputValue } = useInput({
        defaultValue: sum ? sum : '',
    })
    const { isSendFetchLoading, sendFetch } = useSendFetch<
        number,
        IPayBalanceFormData
    >({
        apiCallback: payBalanceFormApi.pay,
        errorText: 'Ошибка при пополнении баланса',
    })
    const handleSubmit = useCallback(() => {
        if (inputValue.length > 0) {
            sendFetch({
                args: +inputValue,
                afterDataCallback(data) {
                    onPay(data)
                },
            })
        } else {
            showError({text:'Введите сумму'})
        }
    }, [onPay, inputValue])
    return (
        <>
            {isSendFetchLoading ? (
                <Loader marginsPaddings={{ mt: 20, mb: 20 }} />
            ) : (
                <>
                    <CustomInput
                        mask="99999999999999999999999"
                        styled={{ width: { type: 'absolute', value: '100%' } }}
                        keyboardType="numeric"
                        onSubmitEditing={handleSubmit}
                        placeholder="Введите сумму"
                        value={inputValue}
                        onChangeText={handleChangeInputValue}
                    />
                    <CustomButton
                        disabled={isSendFetchLoading}
                        onPress={handleSubmit}
                        styled={{
                            marginsPaddings: { mt: 15 },
                            width: { type: 'absolute', value: '100%' },
                        }}
                    >
                        Подтвердить
                    </CustomButton>
                </>
            )}
        </>
    )
})
