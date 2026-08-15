import { memo, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { InfoCard } from '../../../entities/InfoCard'
import { AddJoinAccountConfirm } from '../../../features/AddJoinAccount/AddJoinAccountConfirm'
import { AddJoinAccountSent } from '../../../features/AddJoinAccount/AddJoinAccountSent'
import {
    AddJoinAccountForm,
    TAddJoinAccountDraft,
} from '../../../features/AddJoinAccount/AddJoinAccountWidget'
import { SIZES, SPACING, TAddJoinAccountScreenParams } from '../../../shared'
import { ADD_JOIN_ACCOUNT_INFO_TEXTS } from '../config/constants/ADD_JOIN_ACCOUNT_INFO_TEXTS'
import { TAddJoinAccountStep } from '../config/types/TAddJoinAccountStep'

type Props = {
    params: Partial<TAddJoinAccountScreenParams>
}

export const AddJoinAccountWidget = memo(({ params }: Props) => {
    const [draft, setDraft] = useState<TAddJoinAccountDraft>({
        name: undefined,
        phone: '',
    })
    const [step, setStep] = useState<TAddJoinAccountStep>('form')

    const handleSubmitForm = useCallback((draft: TAddJoinAccountDraft) => {
        setDraft(draft)
        setStep('confirm')
    }, [])

    const handleGoBackFromConfirm = useCallback(() => {
        setStep('form')
    }, [])

    const handleSent = useCallback(() => {
        setStep('sent')
    }, [])

    const styles = StyleSheet.create({
        infoList: {
            gap: SPACING.MD * SIZES.PX,
            marginTop: SPACING.SECTION * SIZES.PX,
        },
    })

    if (step === 'sent') {
        return <AddJoinAccountSent />
    }

    return (
        <>
            {step === 'confirm' ? (
                <AddJoinAccountConfirm
                    onGoBack={handleGoBackFromConfirm}
                    onSent={handleSent}
                    name={draft.name}
                    phone={draft.phone}
                />
            ) : (
                <>
                    <AddJoinAccountForm
                        name={params.name}
                        // Возврат с шага подтверждения не должен терять
                        // набранный номер, поэтому отдаём его обратно в форму.
                        phone={draft.phone || params.phone}
                        onSubmit={handleSubmitForm}
                    />

                    <View style={styles.infoList}>
                        {ADD_JOIN_ACCOUNT_INFO_TEXTS.map((infoBlock) => (
                            <InfoCard
                                key={infoBlock.title}
                                title={infoBlock.title}
                                info={infoBlock.info}
                            />
                        ))}
                    </View>
                </>
            )}
        </>
    )
})
