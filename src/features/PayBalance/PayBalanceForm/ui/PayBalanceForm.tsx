import { memo, useCallback } from 'react'
import { useSendFetch } from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomInput, useInput } from '../../../../shared/CustomInput'
import { Loader } from '../../../../shared/Loader'
import { SumIcon } from '../../../../shared/SumIcon'
import { showError } from '../../../../shared/ToastComponent'
import { payBalanceFormApi } from '../api/payBalanceFormApi'
import { IPayBalanceFormData } from '../config/interfaces/IPayBalanceFormData'

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
            showError({ text: 'Введите сумму' })
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
                        icon={<SumIcon />}
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
                        ПЕРЕЙТИ К ОПЛАТЕ
                    </CustomButton>
                </>
            )}
        </>
    )
})
