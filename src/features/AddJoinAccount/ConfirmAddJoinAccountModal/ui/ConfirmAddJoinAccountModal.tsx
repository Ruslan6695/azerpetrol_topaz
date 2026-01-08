import { memo, useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { ProfileImg } from '../../../../entities/Profile/ProfileImg'
import { SIZES, useFetchData, useModal, useSendFetch } from '../../../../shared'
import BottomSheet from '../../../../shared/BottomSheet/ui/BottomSheet'
import { CustomButton } from '../../../../shared/CustomButton'
import { showToast } from '../../../../shared/ToastComponent'
import { Typography } from '../../../../shared/Typography'
import { MapInfoBlocks } from '../../../MapInfoBlocks'
import { confirmAddJoinAccountModalApi } from '../api/confirmAddJoinAccountModalApi'
import { CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS } from '../config/constants/CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS'

type Props = {}

export const ConfirmAddJoinAccountModal = memo(({}: Props) => {
    const { data, fetchData, isDataLoading } = useFetchData({
        apiCallback: confirmAddJoinAccountModalApi.getInfo,
        errorText: 'Ошибка при получении данных',
    })
    const {
        sendFetch: sendConfirmFetch,
        isSendFetchLoading: isConfirmLoading,
    } = useSendFetch({
        apiCallback: confirmAddJoinAccountModalApi.confirm,
        errorText: 'Не удалось присоединиться к общему балансу.',
    })
    const { sendFetch: sendAbortFetch, isSendFetchLoading: isAbortLoading } =
        useSendFetch({
            apiCallback: confirmAddJoinAccountModalApi.abort,
            errorText: 'Не удалось присоединиться к общему балансу.',
        })
    const { handleCloseModal, handleOpenModal, isShowModal } = useModal()

    const handleConfirm = useCallback(() => {
        if (data?.invite) {
            sendConfirmFetch({
                args: undefined,
                afterDataCallback(data) {
                    showToast({
                        text: 'Привязка к общему счету прошла успешно',
                        type: 'success',
                    })
                },
                finalyCallback() {
                    handleCloseModal()
                },
            })
        }
    }, [data])
    const handleAbort = useCallback(() => {
        if (data?.invite) {
            sendAbortFetch({
                args: undefined,
                afterDataCallback(data) {},
                finalyCallback() {
                    handleCloseModal()
                },
            })
        }
    }, [data])

    useEffect(() => {
        fetchData({
            args: undefined,
            onErrorCallback(error) {
                handleCloseModal()
            },
            afterDataCallback(data) {
                if (data.invite) {
                    handleOpenModal()
                }
            },
            hideToastOnError: true,
        })
    }, [])

    return (
        <BottomSheet isOpened={isShowModal} bgDark>
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <CustomButton
                        onPress={handleAbort}
                        styled={{
                            type: 'secondary',
                            width: { type: 'px', value: 120 },
                            height: { type: 'px', value: 48 },
                        }}
                    >
                        Отклонить
                    </CustomButton>
                    <CustomButton
                        onPress={handleConfirm}
                        styled={{
                            width: { type: 'px', value: 120 },
                            height: { type: 'px', value: 48 },
                        }}
                    >
                        Принять
                    </CustomButton>
                </View>
                <ProfileImg size={90} />
                <Typography
                    type="displayMedium"
                    textAlign="center"
                    marginsPaddings={{ mt: 10 }}
                >
                    {data?.invite?.name}
                </Typography>
                <Typography
                    type="bodySmall"
                    textAlign="center"
                    marginsPaddings={{ mb: 10 }}
                >
                    {data?.invite?.phone}
                </Typography>
                <Typography textAlign="center">
                    {`Приглашает вас присоединиться к общему балансу.`}
                </Typography>
                <MapInfoBlocks
                    infoBlocks={CONFIRM_ADD_JOIN_ACCOUNT_MODAL_INFO_TEXTS}
                />
            </View>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    container: {
        padding: SIZES.PX * 20,
        alignItems: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: SIZES.PX * 20,
    },
})
