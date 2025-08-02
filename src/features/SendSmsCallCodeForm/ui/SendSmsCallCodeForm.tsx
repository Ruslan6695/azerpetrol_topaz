import { memo, useCallback, useState } from 'react'
import { MPLayout } from '../../../shared/MpLayout'
import { SendPhoneCallCode } from './SendPhoneCallCode'
import { SendSmsCode } from './SendSmsCode'

type Props = {
    onSend: (smsCode: string) => void
    onToggleConfirmationType: () => void
    confirmationType: 'sms' | 'call'
}

export const SendSmsCallCodeForm = memo(
    ({ onSend, confirmationType, onToggleConfirmationType }: Props) => {
      
        return (
            <MPLayout mt={20}>
                {confirmationType === 'call' ? (
                    <SendPhoneCallCode
                        onSendCode={onSend}
                        sendSms={onToggleConfirmationType}
                    />
                ) : (
                    <SendSmsCode onSubmit={onSend} />
                )}
            </MPLayout>
        )
    }
)
