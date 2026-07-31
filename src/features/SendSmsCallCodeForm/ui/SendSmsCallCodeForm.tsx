import { memo } from 'react'
import { SendPhoneCallCode } from './SendPhoneCallCode'
import { SendSmsCode } from './SendSmsCode'

type Props = {
    onSend: (smsCode: string) => void
    onToggleConfirmationType: () => void
    confirmationType: 'sms' | 'call'
    isLoading?: boolean
}

export const SendSmsCallCodeForm = memo(
    ({
        onSend,
        confirmationType,
        onToggleConfirmationType,
        isLoading,
    }: Props) => {
        if (confirmationType === 'call') {
            return (
                <SendPhoneCallCode
                    onSendCode={onSend}
                    sendSms={onToggleConfirmationType}
                    isLoading={isLoading}
                />
            )
        }

        return <SendSmsCode onSubmit={onSend} isLoading={isLoading} />
    }
)
