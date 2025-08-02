import React, { useCallback } from 'react'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { CustomText } from '../../../../shared/CustomText'
import { StyleSheet, View } from 'react-native'
import { SIZES, useSendFetch } from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'
import { deleteJoinAccountApi } from '../api/deleteJoinAccountApi'
import { ProfileImg } from '../../../../entities/Profile/ProfileImg'
import { Loader } from '../../../../shared/Loader'

type Props = {
    isOpened: boolean
    handleClose: () => void
    deletingAccount: IProfileJoinAccountItem
    onDeleteAccount: () => void
}

export const DeleteJoinAccountModal = ({
    isOpened,
    handleClose,
    deletingAccount,
    onDeleteAccount,
    
}: Props) => {
    const { isSendFetchLoading, sendFetch } = useSendFetch({
        apiCallback: deleteJoinAccountApi.delete,
        errorText: 'Ошибка при удалении аккаунта',
    })
    const handleSubmit = useCallback(() => {
        sendFetch({
            args: { accountId: deletingAccount.id },
            afterDataCallback(data) {
                onDeleteAccount()
            },
            finalyCallback() {
                handleClose()
            },
        })
    }, [deletingAccount, onDeleteAccount])
    return (
        <BottomSheet
            closeOnPressOutside
            bottomPx={150}
            bgDark
            isOpened={isOpened}
            handleClose={handleClose}
        >
            <View style={styles.container}>
                {isSendFetchLoading ? (
                    <Loader marginsPaddings={{ mt: 150 }} />
                ) : (
                    <>
                        <View style={styles.buttonsRow}>
                            <CustomButton
                                onPress={handleClose}
                                styled={{
                                    width: { type: 'px', value: 110 },
                                    height: { type: 'px', value: 45 },
                                    type: 'OUTLINED',
                                    fz: 14,
                                }}
                            >
                                Отменить
                            </CustomButton>
                            <CustomButton
                                onPress={handleSubmit}
                                styled={{
                                    width: { type: 'px', value: 110 },
                                    height: { type: 'px', value: 45 },
                                    type: 'ERROR',
                                    fz: 14,
                                }}
                            >
                                Подтвердить
                            </CustomButton>
                        </View>
                        <CustomText
                            fz={20}
                            marginsPaddings={{ mt: 20, mb: 40 }}
                        >
                            Вы точно хотите отвязать аккаунт?
                        </CustomText>
                        <ProfileImg size={90} />
                        <CustomText
                            fw="600"
                            fz={20}
                            marginsPaddings={{ mt: 10 }}
                        >
                            {deletingAccount.name}
                        </CustomText>
                    </>
                )}
            </View>
        </BottomSheet>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: SIZES.PX * 20,
        alignItems: 'center',
    },
    buttonsRow: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
})
