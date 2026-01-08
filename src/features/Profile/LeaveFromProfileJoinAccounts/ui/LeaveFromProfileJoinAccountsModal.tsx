import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { SIZES, useSendFetch } from '../../../../shared'
import { CustomButton } from '../../../../shared/CustomButton'
import { CustomModal } from '../../../../shared/CustomModal'
import { Loader } from '../../../../shared/Loader'
import { leaveFromProfileJoinAccountsApi } from '../api/leaveFromProfileJoinAccountsApi'

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
                title="Подтвердите выход из группы"
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
                                    width: { type: 'absolute', value: '100%' },
                                }}
                            >
                                Подтвердить
                            </CustomButton>
                            <CustomButton
                                onPress={handleClose}
                                styled={{
                                    type: 'secondary',
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
