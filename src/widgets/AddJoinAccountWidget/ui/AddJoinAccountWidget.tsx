import { memo, useCallback, useState } from 'react'
import { AddJoinAccountForm } from '../../../features/AddJoinAccount/AddJoinAccountWidget'
import { AddJoinAccountConfirm } from '../../../features/AddJoinAccount/AddJoinAccountConfirm'
import { MapInfoBlocks } from '../../../features/MapInfoBlocks'
import { ADD_JOIN_ACCOUNT_INFO_TEXTS } from '../constants/ADD_JOIN_ACCOUNT_INFO_TEXTS'
import { TAddJoinAccountScreenParams } from '../../../shared'
import { View } from 'react-native'

type Props = {
    params: Partial<TAddJoinAccountScreenParams>
}

export const AddJoinAccountWidget = memo(({ params }: Props) => {
    const [state, setState] = useState<{
        name?: string
        phone: string
    }>({ name: undefined, phone: '' })
    const [isOnConfirm, setisOnConfirm] = useState(false)

    const handleChangeState = useCallback(
        (state: { name?: string; phone: string }) => {
            setState(state)
            setisOnConfirm(true)
        },
        []
    )

    const handleGoBackFromConfirm = useCallback(() => {
        setisOnConfirm(false)
    }, [])
    return (
        <View>
            {isOnConfirm ? (
                <AddJoinAccountConfirm
                    onGoBack={handleGoBackFromConfirm}
                    name={state.name}
                    phone={state.phone}
                />
            ) : (
                <AddJoinAccountForm
                    name={params.name}
                    phone={params.phone}
                    onSubmit={handleChangeState}
                />
            )}

            <MapInfoBlocks infoBlocks={ADD_JOIN_ACCOUNT_INFO_TEXTS} />
        </View>
    )
})
