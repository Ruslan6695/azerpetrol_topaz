import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { ProfileImg } from '../../../../entities/Profile/ProfileImg'
import { IProfileJoinAccountItem } from '../../../../entities/Profile/ProfileJoinAccountItem'
import { SIZES, useSendFetch } from '../../../../shared'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { CustomButton } from '../../../../shared/CustomButton'
import { Loader } from '../../../../shared/Loader'
import { Typography } from '../../../../shared/Typography'
import { deleteJoinAccountApi } from '../api/deleteJoinAccountApi'

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
        <BottomSheet bgDark isOpened={isOpened} handleClose={handleClose}>
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
                                    type: 'secondary',
                                }}
                            >
                                Отменить
                            </CustomButton>
                            <CustomButton
                                onPress={handleSubmit}
                                styled={{
                                    width: { type: 'px', value: 140 },
                                    height: { type: 'px', value: 45 },
                                }}
                            >
                                Подтвердить
                            </CustomButton>
                        </View>
                        <Typography
                            type="bodyMedium"
                            marginsPaddings={{ mt: 20, mb: 40 }}
                        >
                            Вы точно хотите отвязать аккаунт?
                        </Typography>
                        <ProfileImg size={90} />
                        <Typography
                            type="displayMedium"
                            marginsPaddings={{ mt: 10 }}
                        >
                            {deletingAccount.name}
                        </Typography>
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
        marginBottom: 30 * SIZES.PX,
    },
    buttonsRow: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
})
