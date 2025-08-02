import { memo, useCallback } from 'react'
import { CustomModal } from '../../../../shared/CustomModal'
import { StyleSheet, View } from 'react-native'
import { SIZES, useSendFetch } from '../../../../shared'
import { CustomText } from '../../../../shared/CustomText'
import { CustomButton } from '../../../../shared/CustomButton'
import { leaveFromProfileJoinAccountsApi } from '../api/leaveFromProfileJoinAccountsApi'
import { Loader } from '../../../../shared/Loader'

type Props = {
    handleClose: () => void
    isOpened: boolean
    onLeave: () => void
}

export const LeaveFromProfileJoinAccountsModal = memo(
    ({ handleClose, isOpened, onLeave }: Props) => {
        const { errorText, isSendFetchLoading, sendFetch } = useSendFetch({
            apiCallback: leaveFromProfileJoinAccountsApi.leave,
            errorText: 'Ошибка при выходе из группы',
        })

        const handleSubmit = useCallback(() => {
            sendFetch({
                args: undefined,
                afterDataCallback(data) {
                    onLeave()
                },
                finalyCallback() {
                    handleClose()
                },
            })
        }, [onLeave])
        return (
            <CustomModal
                title="ПОДТВЕРДИТЕ ВЫХОД ИЗ ГРУППЫ"
                bgDark
                handleClose={handleClose}
                isModalOpened={isOpened}
            >
                <View style={styles.container}>
                    {isSendFetchLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <CustomButton
                                onPress={handleSubmit}
                                styled={{
                                    type: 'DARK',
                                    width: { type: 'absolute', value: '100%' },
                                }}
                            >
                                Подтвердить
                            </CustomButton>
                            <CustomButton
                                onPress={handleClose}
                                styled={{
                                    type: 'OUTLINED',
                                    marginsPaddings: { mt: 10 },
                                    width: { type: 'absolute', value: '100%' },
                                }}
                            >
                                Отменить
                            </CustomButton>
                        </>
                    )}
                </View>
            </CustomModal>
        )
    }
)

const styles = StyleSheet.create({
    container: {
        width: SIZES.WIDTH(0.85),
        alignItems: 'center',
        height: 150 * SIZES.PX,
        justifyContent: 'center',
    },
})
