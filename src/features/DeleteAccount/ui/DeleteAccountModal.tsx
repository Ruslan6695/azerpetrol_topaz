import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, UserStore, useSendFetch } from '../../../shared'
import BottomSheet from '../../../shared/BottomSheet/ui/BottomSheet'
import { CloseIcon } from '../../../shared/CloseIcon'
import { CustomButton } from '../../../shared/CustomButton'
import { CustomTouchableOpacity } from '../../../shared/CustomTouchableOpacity'
import { Loader } from '../../../shared/Loader'
import { showToast } from '../../../shared/ToastComponent'
import { Typography } from '../../../shared/Typography'
import { SendSmsCallCodeForm } from '../../SendSmsCallCodeForm'
import { deleteAccountApi } from '../api/deleteAccountApi'

type Props = {
    isOpened: boolean
    handleClose: () => void
}

export const DeleteAccountModal = ({ handleClose, isOpened }: Props) => {
    const [callSmsType, setCallSmsType] = useState<'call' | 'sms'>('call')
    const [road, setRoad] = useState<'confirm' | 'sms'>('confirm')
    const logout = UserStore.useLogout()
    const { isSendFetchLoading: isDeleteLoading, sendFetch: sendDelete } =
        useSendFetch({
            apiCallback: deleteAccountApi.delete,
            errorText: 'Произошла ошибка при удалении профиля',
        })
    const {
        isSendFetchLoading: isSendConfirmLoading,
        sendFetch: confirmDelete,
    } = useSendFetch({
        apiCallback: deleteAccountApi.confirm,
        errorText: 'Произошла ошибка при удалении профиля',
    })

    const handleToggleCallSmsType = useCallback(() => {
        sendDelete({
            args: callSmsType === 'sms' ? 1 : 0,
            afterDataCallback(data) {
                setCallSmsType('sms')
            },
            onErrorCallback(error) {
                handleClose()
            },
        })
    }, [callSmsType])

    const handleDelete = useCallback(() => {
        sendDelete({
            args: callSmsType === 'sms' ? 1 : 0,
            afterDataCallback(data) {
                setRoad('sms')
            },
            onErrorCallback(error) {
                handleClose()
            },
        })
    }, [callSmsType])

    const handleConfirm = useCallback((smsCode: string) => {
        confirmDelete({
            args: smsCode,
            afterDataCallback(data) {
                showToast({ text: 'Аккаунт успешно удален', type: 'success' })
                logout()
            },
            finalyCallback() {
                handleClose()
            },
        })
    }, [])

    return (
        <BottomSheet bgDark isOpened={isOpened} handleClose={handleClose}>
            <View style={styles.container}>
                <CustomTouchableOpacity
                    onPress={handleClose}
                    style={styles.closeIcon}
                >
                    <CloseIcon size={30} />
                </CustomTouchableOpacity>

                {isDeleteLoading || isSendConfirmLoading ? (
                    <Loader marginsPaddings={{ mt: 150 }} />
                ) : road === 'confirm' ? (
                    <>
                        <Typography
                            marginsPaddings={{ mt: 50 }}
                            type="bodyAccentMedium"
                        >
                            Вы точно хотите удалить аккаунт?
                        </Typography>
                        <CustomButton
                            onPress={handleDelete}
                            styled={{
                                marginsPaddings: { mt: 20, mb: 16 },
                            }}
                        >
                            ПОДТВЕРДИТЬ
                        </CustomButton>
                        <CustomButton
                            onPress={() => {
                                handleClose()
                            }}
                            styled={{ type: 'secondary' }}
                        >
                            ОТМЕНИТЬ
                        </CustomButton>
                    </>
                ) : (
                    <SendSmsCallCodeForm
                        onToggleConfirmationType={handleToggleCallSmsType}
                        onSend={handleConfirm}
                        confirmationType={callSmsType}
                    />
                )}
            </View>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: SIZES.PX * 20,
        marginBottom: 40,
    },
    closeIcon: {
        padding: SIZES.PX * 10,
        position: 'absolute',
        right: 10 * SIZES.PX,
        top: SIZES.PX * 10,
        zIndex: 1,
    },
})
